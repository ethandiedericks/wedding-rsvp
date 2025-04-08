
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { supabaseServer } from "@/lib/supabase"

export async function getSession() {
  const supabase = supabaseServer()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function signIn(email: string, password: string) {
  'use server'
  
  const supabase = supabaseServer()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    if (!data.user) throw new Error("No user data returned")

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (profileError) throw profileError

    // Force revalidation
    revalidatePath('/', 'page')
    revalidatePath('/admin', 'page')
    revalidatePath('/auth/signin', 'page')
    
    return { user: data.user, role: profileData?.role || 'guest' }
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}
