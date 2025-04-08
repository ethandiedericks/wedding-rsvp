
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from "@/lib/supabase"
import type { RSVP } from "@/types/admin"

export async function updateRSVP(rsvp: RSVP) {
  const { error } = await supabaseServer()
    .from("rsvp")
    .update({
      attending: rsvp.attending,
      guest_count: rsvp.guest_count,
      additional_guests: rsvp.additional_guests,
      dietary_restrictions: rsvp.dietary_restrictions,
      song_request: rsvp.song_request,
    })
    .eq("id", rsvp.id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin')
  return { message: "RSVP updated successfully" }
}

export async function deleteRSVP(rsvpId: string) {
  // First, release any claimed gifts
  const { data: claimedGifts, error: giftError } = await supabaseServer()
    .from("gifts")
    .select("id")
    .eq("claimed_by", rsvpId)

  if (giftError) throw new Error("Error checking claimed gifts: " + giftError.message)

  if (claimedGifts && claimedGifts.length > 0) {
    const giftIds = claimedGifts.map((gift) => gift.id)
    const { error: updateError } = await supabaseServer()
      .from("gifts")
      .update({ available: true, claimed_by: null })
      .in("id", giftIds)

    if (updateError) throw new Error("Error releasing claimed gifts: " + updateError.message)
  }

  const { error } = await supabaseServer()
    .from("rsvp")
    .delete()
    .eq("id", rsvpId)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin')
  return { message: "RSVP deleted successfully" }
}

export async function submitRSVP(formData: FormData) {
  const {
    data: { session },
  } = await supabaseServer().auth.getSession()

  if (!session?.user?.id) {
    throw new Error("You must be logged in to RSVP")
  }

  const attending = formData.get("attending") === "true"
  const guestCount = parseInt(formData.get("guestCount") as string, 10)
  const dietaryRestrictions = formData.get("dietaryRestrictions") as string
  const songRequest = formData.get("songRequest") as string
  const additionalGuests = JSON.parse(formData.get("additionalGuests") as string || "[]")
  const selectedGift = formData.get("selectedGift") as string

  const { error: rsvpError } = await supabaseServer().from("rsvp").upsert({
    id: session.user.id,
    attending,
    guest_count: attending ? guestCount : 0,
    additional_guests: additionalGuests.length > 0 ? additionalGuests : null,
    dietary_restrictions: dietaryRestrictions || null,
    song_request: songRequest || null,
  })

  if (rsvpError) throw new Error(rsvpError.message)

  if (selectedGift) {
    const { error: giftError } = await supabaseServer()
      .from("gifts")
      .update({ available: false, claimed_by: session.user.id })
      .eq("id", selectedGift)
      .eq("available", true)

    if (giftError) throw new Error("Failed to claim gift: " + giftError.message)
  }

  revalidatePath('/rsvp')
  return { message: "RSVP submitted successfully" }
}
