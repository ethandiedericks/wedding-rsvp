"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import type { FormData } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, Music, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type AdditionalInfoStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  prevStep: () => void;
  isSubmitting: boolean;
};

export default function AdditionalInfoStep({
  formData,
  setFormData,
  prevStep,
  isSubmitting,
}: AdditionalInfoStepProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, halaalPreference: checked });
  };

  return (
    <CardContent className="p-6 md:p-8">
      <div className="space-y-6">
        <div className="text-center mb-2">
          <h3 className="font-serif text-xl font-medium text-[#2D2D2D] mb-2">
            Additional Information
          </h3>
          <p className="text-muted-foreground text-sm">
            Help us make your experience special with these final details
          </p>
        </div>

        <div className="space-y-5">

          <div className="flex items-center space-x-2 pt-2 pb-2">
            <Checkbox 
              id="halaalPreference" 
              checked={formData.halaalPreference}
              onCheckedChange={handleCheckboxChange}
              className="border-[#D4B56A] data-[state=checked]:bg-[#D4B56A] data-[state=checked]:text-white"
            />
            <Label 
              htmlFor="halaalPreference" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I prefer Halaal food options
            </Label>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="songRequest"
              className="text-[#2D2D2D] flex items-center"
            >
              <Music size={16} className="mr-2 text-[#D4B56A]" />
              Song Request{" "}
              <span className="text-muted-foreground font-normal ml-1">
                (optional)
              </span>
            </Label>
            <Textarea
              id="songRequest"
              name="songRequest"
              value={formData.songRequest}
              onChange={handleChange}
              placeholder="What song would get you on the dance floor?"
              rows={3}
              className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
            />
            <p className="text-xs text-muted-foreground">
              Suggest a song you&apos;d love to hear at our reception
            </p>
          </div>
        </div>

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
            type="submit"
            disabled={isSubmitting}
            className="bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit RSVP"
            )}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
