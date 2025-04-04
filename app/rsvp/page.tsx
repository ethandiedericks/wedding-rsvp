"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import StepIndicator from "@/components/rsvp/StepIndicator";
import PersonalInfoStep from "@/components/rsvp/PersonalInfoStep";
import AttendanceStep from "@/components/rsvp/AttendanceStep";
import PartySelectionStep from "@/components/rsvp/PartySelectionStep";
import AdditionalInfoStep from "@/components/rsvp/AdditionalInfoStep";
import SuccessMessage from "@/components/rsvp/SuccessMessage";
import { FormData, Gift, RSVPRecord } from "@/lib/types";
import Loader from "@/components/Loader";

export default function RSVP() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    attending: null,
    guestCount: 0,
    gender: null,
    partyChoice: "none",
    selectedGift: null,
    dietaryRestrictions: "",
    songRequest: "",
  });
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        router.replace("/auth/signin");
        return;
      }

      // Check if user has already submitted an RSVP
      const { data: existingRSVP, error: rsvpError } = await supabase
        .from("rsvp")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (rsvpError && rsvpError.code !== "PGRST116") {
        // PGRST116 means no rows found
        toast.error("Error checking RSVP status");
        return;
      }

      if (existingRSVP) {
        setHasSubmitted(true);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        toast.error("Error loading profile");
        router.replace("/auth/signin");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        fullName: profileData?.full_name || "",
        email: session.user.email || "",
      }));

      fetchGifts();
      setHasSubmitted(false);
    };
    checkAuthAndLoad();
  }, [router]);

  const fetchGifts = async () => {
    const { data, error } = await supabase
      .from("gifts")
      .select("id, name, available")
      .eq("available", true);
    if (error) {
      toast.error("Error fetching gifts");
    } else {
      setGifts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      toast.error("You must be logged in to RSVP");
      router.replace("/auth/signin");
      setIsSubmitting(false);
      return;
    }

    if (!formData.fullName || formData.attending === null || !formData.gender) {
      toast.error("Please complete all required fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.selectedGift) {
      const { data: giftCheck, error: giftCheckError } = await supabase
        .from("gifts")
        .select("available")
        .eq("id", formData.selectedGift)
        .single();

      if (giftCheckError || !giftCheck?.available) {
        toast.error("This gift is no longer available");
        fetchGifts();
        setIsSubmitting(false);
        return;
      }
    }

    const { error: rsvpError } = await supabase.from("rsvp").upsert({
      id: session.user.id,
      attending: formData.attending,
      guest_count: formData.attending ? formData.guestCount : 0,
      party_choice:
        formData.attending && formData.partyChoice !== "none"
          ? formData.partyChoice
          : "none",
      gender: formData.gender,
      dietary_restrictions: formData.dietaryRestrictions || null,
      song_request: formData.songRequest || null,
    });

    if (rsvpError) {
      toast.error(rsvpError.message);
      setIsSubmitting(false);
      return;
    }

    if (formData.selectedGift) {
      const { error: giftError } = await supabase
        .from("gifts")
        .update({ available: false, claimed_by: session.user.id })
        .eq("id", formData.selectedGift)
        .eq("available", true);

      if (giftError) {
        toast.error("Failed to claim gift: " + giftError.message);
        setIsSubmitting(false);
        return;
      }
      fetchGifts();
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: formData.fullName })
      .eq("id", session.user.id);

    if (profileError) {
      toast.error("Failed to update profile: " + profileError.message);
    }

    setIsSubmitting(false);
    setHasSubmitted(true);
    toast.success("RSVP submitted successfully!");
  };

  if (hasSubmitted === null) {
    return <Loader />;
  }

  if (hasSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-[40rem] mx-auto">
        <StepIndicator step={step} />
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <PersonalInfoStep
              formData={formData}
              setFormData={setFormData}
              nextStep={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <AttendanceStep
              formData={formData}
              setFormData={setFormData}
              gifts={gifts}
              prevStep={() => setStep(1)}
              nextStep={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <PartySelectionStep
              formData={formData}
              setFormData={setFormData}
              prevStep={() => setStep(2)}
              nextStep={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <AdditionalInfoStep
              formData={formData}
              setFormData={setFormData}
              prevStep={() => setStep(3)}
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </Card>
    </div>
  );
}
