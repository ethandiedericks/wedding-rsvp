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
    additional_guests: [], // This should be an array of { full_name: "", surname: "" } objects when guests are added
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
    // Skip the party selection step (step 3)
    if (step === 2 && newStep === 3) {
      setStep(4); // Skip to additional info step
    } else if (step === 4 && newStep === 3) {
      setStep(2); // Go back to attendance step
    } else {
      setStep(newStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.fullName || formData.attending === null) {
        toast.error("Please complete all required fields");
        return;
      }

      // Validate additional guests if attending with others
      if (formData.attending && formData.guestCount > 1) {
        if (formData.additional_guests.length < formData.guestCount - 1) {
          toast.error("Please provide details for all additional guests");
          return;
        }

        for (const guest of formData.additional_guests) {
          if (!guest.full_name || !guest.surname) {
            toast.error("Please complete all guest details");
            return;
          }
        }
      }

      const submitFormData = new FormData();
      submitFormData.append("attending", formData.attending.toString());
      submitFormData.append("guestCount", formData.guestCount.toString());
      submitFormData.append("additionalGuests", JSON.stringify(formData.additional_guests));
      submitFormData.append("dietaryRestrictions", formData.dietaryRestrictions);
      submitFormData.append("songRequest", formData.songRequest);
      if (formData.selectedGift) {
        submitFormData.append("selectedGift", formData.selectedGift.toString());
      }

      const result = await submitRSVP(submitFormData);
      toast.success(result.message);
      setHasSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit RSVP");
    } finally {
      setIsSubmitting(false);
    }
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
            <StepIndicator step={step} totalSteps={3} />
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
                      prevStep={() => handleStepChange(3)}
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
