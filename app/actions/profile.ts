'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from "@/lib/supabase"

export async function getProfile(userId: string) {
  const { data, error } = await supabaseServer()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
    
  if (error) throw new Error(error.message)
  return data
}

export async function getProfiles() {
  const { data, error } = await supabaseServer()
    .from("profiles")
    .select("id, full_name")
    
  if (error) throw new Error(error.message)
  return data
}