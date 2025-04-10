"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { checkExistingRSVP, getAvailableGifts, getUserProfile, submitRSVP } from "@/app/actions/actions";

export default function RSVP() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    attending: null,
    guestCount: 1, // Default to 1 person (the logged-in user)
    additional_guests: [], // This should be an array of { full_name: "", surname: "" } objects when guests are added
    selectedGift: null,

    songRequest: "",
    halaalPreference: false,
  });
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      setLoading(true);
      try {
        // Check if user is authenticated and has an existing RSVP
        const result = await checkExistingRSVP();
        
        // If not authenticated, redirect to login
        if (result === null) {
          router.replace("/auth/signin?redirectedFrom=/rsvp");
          return;
        }

        const { profile, rsvp } = result;

        // If user has already submitted an RSVP
        if (rsvp) {
          setHasSubmitted(true);
          setLoading(false);
          return;
        }

        // User is authenticated but hasn't submitted an RSVP yet
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: profile.full_name || "",
            email: profile.email || "",
          }));
          setHasSubmitted(false);
        } else {
          // Profile not found
          toast.error("Error loading profile");
          router.replace("/");
        }
      } catch (error) {
        console.error("Error in RSVP page:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [router]);

  // Only fetch gifts when we reach the gift selection step
  useEffect(() => {
    const fetchGifts = async () => {
      if (step === 2 && formData.attending === true && gifts.length === 0) {
        try {
          const availableGifts = await getAvailableGifts();
          setGifts(availableGifts);
        } catch (error) {
          toast.error("Error fetching gifts");
        }
      }
    };
    fetchGifts();
  }, [step, formData.attending, gifts.length]);

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

    if (!formData.fullName || formData.attending === null) {
      toast.error("Please complete all required fields");
      setIsSubmitting(false);
      return;
    }

    // Validate additional guests if attending with others
    if (formData.attending && formData.guestCount > 1) { // Changed from guestCount > 0 to > 1
      // The expected number of additional guests is guestCount - 1 (excluding the main attendee)
      if (formData.additional_guests.length !== formData.guestCount - 1) {
        console.log('Guest validation failed:', {
          guestCount: formData.guestCount,
          additionalGuestsLength: formData.additional_guests.length
        });
        toast.error(
          "Please provide details for all additional guests or adjust the guest count"
        );
        setIsSubmitting(false);
        return;
      }

      const invalidGuests = formData.additional_guests.some(
        (guest) => !guest.full_name || !guest.surname
      );
      if (invalidGuests) {
        toast.error(
          "Please provide both first name and surname for all guests"
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await submitRSVP(formData);
      // Refresh gift list in case one was claimed
      const availableGifts = await getAvailableGifts();
      setGifts(availableGifts);
      setIsSubmitting(false);
      setHasSubmitted(true);
      toast.success("RSVP submitted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit RSVP");
      }
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
