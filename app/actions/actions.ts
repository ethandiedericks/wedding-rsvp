// app/actions.ts
"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getAuthenticatedSupabase() {
  const supabase = await supabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/signin?message=Please sign in to access this page");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/unauthorized");
  }

  return supabase;
}

export async function checkAuth() {
  await getAuthenticatedSupabase();
}

export async function fetchRSVPs() {
  const supabase = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("rsvp")
    .select("*, additional_guests");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchGifts() {
  const supabase = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("gifts")
    .select("id, name, available, claimed_by, image_url");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchCrew() {
  const supabase = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("bridal_crew")
    .select("id, name, role, headshot_url, quote");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchProfiles() {
  const supabase = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteGift(giftId: number) {
  const supabase = await getAuthenticatedSupabase();
  const { error } = await supabase
    .from("gifts")
    .delete()
    .eq("id", giftId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteCrewMember(crewId: number) {
  const supabase = await getAuthenticatedSupabase();
  const { error } = await supabase
    .from("bridal_crew")
    .delete()
    .eq("id", crewId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteRSVP(rsvpId: string) {
  const supabase = await getAuthenticatedSupabase();
  
  // First check if the RSVP exists
  const { data: rsvp, error: fetchError } = await supabase
    .from("rsvp")
    .select("*")
    .eq("id", rsvpId)
    .single();

  if (fetchError) {
    throw new Error("RSVP not found");
  }

  // If a gift was claimed, make it available again
  if (rsvp.gift_id) {
    const { error: giftError } = await supabase
      .from("gifts")
      .update({ available: true, claimed_by: null })
      .eq("id", rsvp.gift_id);

    if (giftError) {
      throw new Error("Failed to update gift status");
    }
  }

  // Delete the RSVP
  const { error: deleteError } = await supabase
    .from("rsvp")
    .delete()
    .eq("id", rsvpId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  revalidatePath("/admin");
}



export async function updateRSVP(rsvp: any) {
  const supabase = await getAuthenticatedSupabase();
  const { error } = await supabase
    .from("rsvp")
    .update({
      ...rsvp,
      additional_guests: rsvp.additional_guests,
    })
    .eq("id", rsvp.id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// Auth actions
export async function getSession() {
  const supabase = await supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  return session; // Can be null if not authenticated, which is expected
}

export async function signOut() {
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function signIn(email: string, password: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("No user data returned");

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = profileError ? "guest" : profileData?.role || "guest";
  return { user: data.user, role };
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("No user data returned");

  // Create profile with guest role
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name: fullName,
      role: "guest",
    });

  if (profileError) throw new Error(profileError.message);
  return { user: data.user, role: "guest" };
}

export async function getUserProfile() {
  const supabase = await supabaseServer();
  
  // First check if we have a session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  // Then verify with getUser
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (profileError) return null;
    return { ...profile, id: user.id, email: user.email };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// RSVP actions
export async function submitRSVP(formData: any) {
  const supabase = await supabaseServer();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to RSVP");
  }

  // Update profile name
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: formData.fullName })
    .eq("id", user.id);

  if (profileError) throw new Error(profileError.message);

  // Log the RSVP data for debugging
  console.log('Submitting RSVP with data:', {
    attending: formData.attending,
    guestCount: formData.guestCount,
    additionalGuests: formData.additional_guests
  });
  
  // Prepare additional guests data - ensure it's properly formatted for JSONB
  const additionalGuests = formData.attending && formData.guestCount > 1 && 
    formData.additional_guests && formData.additional_guests.length > 0 ? 
    formData.additional_guests.map((guest: { full_name: string; surname: string }) => ({
      full_name: guest.full_name,
      surname: guest.surname
    })) : null;
  
  // Create RSVP
  const { error: rsvpError } = await supabase.from("rsvp").insert({
    id: user.id, // Using 'id' instead of 'user_id' to match the database schema
    attending: formData.attending,
    guest_count: formData.attending ? formData.guestCount : 0,
    additional_guests: additionalGuests,
    dietary_restrictions: formData.dietaryRestrictions || null,
    song_request: formData.songRequest || null,
    halaal_preference: formData.halaalPreference
  });

  if (rsvpError) throw new Error(rsvpError.message);

  // Claim gift if selected
  if (formData.selectedGift) {
    const { error: giftError } = await supabase
      .from("gifts")
      .update({ available: false, claimed_by: user.id })
      .eq("id", formData.selectedGift)
      .eq("available", true);

    if (giftError) throw new Error(giftError.message);
  }

  revalidatePath("/rsvp");
}

export async function checkExistingRSVP() {
  const supabase = await supabaseServer();
  
  // First check if we have a session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Redirect to login if no session
    return null;
  }
  
  // Then authenticate the user with getUser
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return null;
  }

  try {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Check for existing RSVP - using the id field which matches the user id
    const { data: existingRSVP, error: rsvpError } = await supabase
      .from("rsvp")
      .select("*")
      .eq("id", user.id)
      .single();

    // If no RSVP found, return profile only
    if (rsvpError) {
      return { profile, rsvp: null };
    }

    // Return both profile and RSVP data
    return { profile, rsvp: existingRSVP };
  } catch (error) {
    console.error("Error in checkExistingRSVP:", error);
    return null;
  }
}

// Gift actions
export async function getAvailableGifts() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("gifts")
    .select("id, name, available, image_url")
    .eq("available", true);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAllGifts() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("gifts")
    .select("id, name, available, claimed_by, image_url");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addGift(name: string, imageFile: File | null) {
  const supabase = await getAuthenticatedSupabase();
  let imageUrl = null;

  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("gift-images")
      .upload(fileName, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: urlData } = supabase.storage
      .from("gift-images")
      .getPublicUrl(fileName);

    imageUrl = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("gifts")
    .insert({
      name,
      available: true,
      image_url: imageUrl,
    });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// Crew actions
export async function addCrewMember(name: string, role: string, headshot: File | null, quote: string | null) {
  const supabase = await getAuthenticatedSupabase();
  let headshotUrl = null;

  if (headshot) {
    const fileName = `${Date.now()}-${headshot.name}`;
    const { error: uploadError } = await supabase.storage
      .from("crew-headshots")
      .upload(fileName, headshot);

    if (uploadError) throw new Error(uploadError.message);

    const { data: urlData } = supabase.storage
      .from("crew-headshots")
      .getPublicUrl(fileName);

    headshotUrl = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("bridal_crew")
    .insert({
      name,
      role,
      headshot_url: headshotUrl,
      quote: quote || null,
    });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function getBridalCrew() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("bridal_crew")
    .select("*");

  if (error) throw new Error(error.message);
  return data ?? [];
}