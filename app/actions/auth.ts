'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from "@/lib/supabase"

export async function getSession() {
  const { data: { session }, error } = await supabaseServer().auth.getSession()
  if (error) throw new Error(error.message)
  return session
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseServer().auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error("No user data returned")

  const { data: profileData, error: profileError } = await supabaseServer()
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (profileError) throw new Error(profileError.message)
  return { user: data.user, role: profileData?.role }
}