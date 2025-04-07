"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import type { FormData } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone } from "lucide-react";

type PersonalInfoStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  nextStep: () => void;
};

export default function PersonalInfoStep({
  formData,
  setFormData,
  nextStep,
}: PersonalInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <CardContent className="p-6 md:p-8">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[#2D2D2D]">
            Full Name
          </Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#2D2D2D]">
            Email Address
          </Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="email"
              name="email"
              value={formData.email}
              disabled
              placeholder="Your email address"
              className="pl-10 border-[#D4B56A]/30 bg-gray-50 text-gray-500"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Email address from your account
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#2D2D2D]">
            Phone Number{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="button"
            onClick={nextStep}
            className="w-full bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
