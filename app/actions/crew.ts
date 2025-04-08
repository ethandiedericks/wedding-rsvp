
'use server'

import { revalidatePath } from 'next/cache'

export async function getCrewMembers() {
  const { data, error } = await supabaseServer()
    .from("bridal_crew")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}
import { supabaseServer } from "@/lib/supabase"

export async function addCrewMember(formData: FormData) {
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const headshot = formData.get("headshot") as File | null
  const quote = formData.get("quote") as string

  if (!name || !role) {
    throw new Error("Name and role are required")
  }

  let headshot_url = null
  if (headshot) {
    const fileName = `${Date.now()}-${headshot.name}`
    const { error: uploadError } = await supabaseServer()
      .storage
      .from("crew-headshots")
      .upload(fileName, headshot)

    if (uploadError) {
      throw new Error("Failed to upload headshot: " + uploadError.message)
    }

    const { data: urlData } = supabaseServer()
      .storage
      .from("crew-headshots")
      .getPublicUrl(fileName)

    headshot_url = urlData.publicUrl
  }

  const { error } = await supabaseServer()
    .from("bridal_crew")
    .insert({
      name,
      role,
      headshot_url,
      quote: quote || null,
    })

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin')
  return { message: "Crew member added successfully" }
}

export async function deleteCrewMember(crewId: number) {
  const { error } = await supabaseServer()
    .from("bridal_crew")
    .delete()
    .eq("id", crewId)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin')
  return { message: "Crew member deleted successfully" }
}
