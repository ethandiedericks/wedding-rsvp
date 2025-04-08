
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from "@/lib/supabase"

export async function addGift(formData: FormData) {
  const name = formData.get("name") as string
  const image = formData.get("image") as File | null

  if (!name) {
    throw new Error("Gift name is required")
  }

  let imageUrl: string | null = null
  if (image) {
    const fileName = `${Date.now()}-${image.name}`
    const { error: uploadError } = await supabaseServer()
      .storage
      .from("gift-images")
      .upload(fileName, image)

    if (uploadError) {
      throw new Error("Failed to upload image: " + uploadError.message)
    }

    const { data: urlData } = supabaseServer()
      .storage
      .from("gift-images")
      .getPublicUrl(fileName)

    imageUrl = urlData.publicUrl
  }

  const { error } = await supabaseServer()
    .from("gifts")
    .insert({
      name,
      available: true,
      image_url: imageUrl,
    })

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin')
  return { message: "Gift added successfully" }
}

export async function getGifts() {
  const { data, error } = await supabaseServer()
    .from("gifts")
    .select("*")
    
  if (error) throw new Error(error.message)
  return data
}

export async function getAvailableGifts() {
  const { data, error } = await supabaseServer()
    .from("gifts")
    .select("id, name, available")
    .eq("available", true)
    
  if (error) throw new Error(error.message)
  return data
}

export async function deleteGift(giftId: number) {
  const { error } = await supabaseServer()
    .from("gifts")
    .delete()
    .eq("id", giftId)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin')
  return { message: "Gift deleted successfully" }
}
