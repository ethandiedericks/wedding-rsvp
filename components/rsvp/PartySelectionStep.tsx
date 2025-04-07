"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FormData } from "@/lib/types";
import { toast } from "sonner";
import {
  UserIcon as Male,
  UserIcon as Female,
  Copy,
  MessageSquare,
} from "lucide-react";

type PartySelectionStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  prevStep: () => void;
  nextStep: () => void;
};

export default function PartySelectionStep({
  formData,
  setFormData,
  prevStep,
  nextStep,
}: PartySelectionStepProps) {
  // Don't automatically skip anymore - we handle this in the parent component
  if (!formData.attending) {
    return (
      <CardContent className="p-6 md:p-8">
        <div className="text-center py-8">
          <h3 className="font-serif text-xl font-medium text-[#2D2D2D] mb-4">
            Party Selection Skipped
          </h3>
          <p className="text-muted-foreground mb-8">
            Since you won&apos;t be attending the wedding, you can skip this
            step.
          </p>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="border-[#D4B56A]/30 text-[#D4B56A] hover:bg-[#D4B56A]/10 hover:text-[#D4B56A]"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 md:p-8">
      <div className="space-y-6">
        <div className="text-center mb-2">
          <h3 className="font-serif text-xl font-medium text-[#2D2D2D] mb-2">
            Bachelor & Bachelorette Parties
          </h3>
          <p className="text-muted-foreground text-sm">
            Would you like to join the pre-wedding celebrations? Select which
            party you&apos;d like to attend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                gender: "male",
                partyChoice: "none",
              })
            }
            className={cn(
              "flex flex-col items-center justify-center p-5 rounded-lg border transition-all duration-300",
              formData.gender === "male"
                ? "bg-[#D4B56A]/10 border-[#D4B56A] text-[#D4B56A]"
                : "bg-white border-[#D4B56A]/30 hover:border-[#D4B56A]/60"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                formData.gender === "male"
                  ? "bg-[#D4B56A] text-white"
                  : "bg-[#D4B56A]/10 text-[#D4B56A]"
              )}
            >
              <Male size={24} />
            </div>
            <span className="font-serif font-medium text-lg">
              Bachelor Party
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              For the gentlemen
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                gender: "female",
                partyChoice: "none",
              })
            }
            className={cn(
              "flex flex-col items-center justify-center p-5 rounded-lg border transition-all duration-300",
              formData.gender === "female"
                ? "bg-[#D4B56A]/10 border-[#D4B56A] text-[#D4B56A]"
                : "bg-white border-[#D4B56A]/30 hover:border-[#D4B56A]/60"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                formData.gender === "female"
                  ? "bg-[#D4B56A] text-white"
                  : "bg-[#D4B56A]/10 text-[#D4B56A]"
              )}
            >
              <Female size={24} />
            </div>
            <span className="font-serif font-medium text-lg">
              Bachelorette Party
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              For the ladies
            </span>
          </button>
        </div>

        {formData.gender && (
          <div className="animate-fadeIn">
            <h4 className="text-center font-medium text-[#2D2D2D] mb-4">
              {formData.gender === "male"
                ? "Will you attend the Bachelor Party?"
                : "Will you attend the Bachelorette Party?"}
            </h4>
            <div className="flex justify-center space-x-4 mb-6">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    partyChoice:
                      formData.gender === "male" ? "bachelor" : "bachelorette",
                  })
                }
                className={cn(
                  "px-6 py-2 rounded-full border transition-all duration-300",
                  formData.partyChoice !== "none"
                    ? "bg-[#D4B56A] text-white border-[#D4B56A]"
                    : "bg-white border-[#D4B56A]/30 hover:border-[#D4B56A]/60 text-[#2D2D2D]"
                )}
              >
                Yes, count me in!
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, partyChoice: "none" })
                }
                className={cn(
                  "px-6 py-2 rounded-full border transition-all duration-300",
                  formData.partyChoice === "none"
                    ? "bg-gray-100 text-gray-700 border-gray-300"
                    : "bg-white border-gray-200 hover:border-gray-300 text-[#2D2D2D]"
                )}
              >
                No, I&apos;ll skip this one
              </button>
            </div>
          </div>
        )}

        {formData.partyChoice !== "none" && (
          <div className="bg-[#FDFBF7] rounded-lg p-6 animate-fadeIn border border-[#D4B56A]/20">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D4B56A] flex items-center justify-center mr-3">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-[#2D2D2D]">
                  Join our WhatsApp Group
                </h4>
                <p className="text-sm text-muted-foreground">
                  For all party updates and coordination
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-md border border-[#D4B56A]/20">
              <span className="flex-1 truncate text-sm">
                {formData.partyChoice === "bachelor"
                  ? "https://chat.whatsapp.com/bachelor-group-link"
                  : "https://chat.whatsapp.com/bachelorette-group-link"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const link =
                    formData.partyChoice === "bachelor"
                      ? "https://chat.whatsapp.com/bachelor-group-link"
                      : "https://chat.whatsapp.com/bachelorette-group-link";
                  navigator.clipboard
                    .writeText(link)
                    .then(() =>
                      toast.success("WhatsApp link copied to clipboard!")
                    )
                    .catch(() => toast.error("Failed to copy link"));
                }}
                className="ml-2 text-[#D4B56A] hover:text-[#C4A55A] hover:cursor-pointer"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="border-[#D4B56A]/30 text-[#D4B56A] hover:bg-[#D4B56A]/10 hover:text-[#D4B56A]"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={nextStep}
            disabled={!formData.gender}
            className="bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
