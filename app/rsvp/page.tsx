"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import type { FormData, Gift } from "@/lib/types";
import { Heart } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      setLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        router.replace("/");
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
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        toast.error("Error loading profile");
        router.replace("/");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        fullName: profileData?.full_name || "",
        email: session.user.email || "",
      }));

      fetchGifts();
      setHasSubmitted(false);
      setLoading(false);
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

  const handleStepChange = (newStep: number) => {
    // If not attending, skip the party selection step
    if (formData.attending === false && newStep === 3) {
      setStep(4); // Skip to additional info step
    } else {
      setStep(newStep);
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
      router.replace("/");
      setIsSubmitting(false);
      return;
    }

    if (!formData.fullName || formData.attending === null) {
      toast.error("Please complete all required fields");
      setIsSubmitting(false);
      return;
    }

    // Only validate gender if attending
    if (formData.attending && !formData.gender) {
      toast.error("Please select your gender for party selection");
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
      gender: formData.gender || "none", // Default to "none" if not attending
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-16 flex flex-col items-center justify-center">
        <Heart className="text-[#D4B56A] animate-pulse mb-4" size={40} />
        <h2 className="font-serif text-2xl font-medium text-[#2D2D2D] mb-2">
          Loading RSVP Form
        </h2>
        <p className="text-muted-foreground">
          Please wait while we prepare your RSVP form...
        </p>
        <div className="mt-8 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4B56A]"></div>
      </div>
    );
  }

  if (hasSubmitted) {
    return <SuccessMessage />;
  }

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="mx-auto text-[#D4B56A] mb-3" size={32} />
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3 text-[#2D2D2D]">
            RSVP
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;re excited to celebrate our special day with you. Please let
            us know if you&apos;ll be joining us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="max-w-[40rem] mx-auto border-none shadow-md overflow-hidden">
            <StepIndicator step={step} totalSteps={4} />
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <PersonalInfoStep
                      formData={formData}
                      setFormData={setFormData}
                      nextStep={() => handleStepChange(2)}
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <AttendanceStep
                      formData={formData}
                      setFormData={setFormData}
                      gifts={gifts}
                      prevStep={() => handleStepChange(1)}
                      nextStep={() => handleStepChange(3)}
                    />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <PartySelectionStep
                      formData={formData}
                      setFormData={setFormData}
                      prevStep={() => handleStepChange(2)}
                      nextStep={() => handleStepChange(4)}
                    />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <AdditionalInfoStep
                      formData={formData}
                      setFormData={setFormData}
                      prevStep={() =>
                        handleStepChange(formData.attending ? 3 : 2)
                      }
                      isSubmitting={isSubmitting}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
