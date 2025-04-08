"use client";

import { cn } from "@/lib/utils";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

type StepIndicatorProps = {
  step: number;
  totalSteps: number;
};

export default function StepIndicator({
  step,
  totalSteps,
}: StepIndicatorProps) {
  // Update steps array to remove "Party Selection"
  const steps = [
    "Your Information",
    "Attendance & Guests",
    "Additional Details",
  ];

  // Adjust the step number for display since we're skipping step 3
  const displayStep = step > 3 ? 3 : step;

  return (
    <CardHeader className="bg-white border-b border-[#D4B56A]/10 pb-6">
      <CardTitle className="font-serif text-2xl text-center text-[#2D2D2D]">
        RSVP
      </CardTitle>
      <p className="text-center text-muted-foreground mt-1 mb-4 text-sm">
        Step {displayStep} of {totalSteps}: {steps[displayStep - 1]}
      </p>
      <div className="flex justify-center space-x-2 mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="relative">
            <div
              className={cn(
                "w-16 h-1.5 rounded-full transition-all duration-300",
                i < displayStep ? "bg-[#D4B56A]" : "bg-[#D4B56A]/20"
              )}
            />
            {i < displayStep && i === displayStep - 1 && (
              <motion.div
                className="absolute inset-0 bg-[#D4B56A] rounded-full"
                layoutId="stepIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>
    </CardHeader>
  );
}
