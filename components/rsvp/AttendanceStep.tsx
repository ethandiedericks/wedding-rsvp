"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import type { FormData, Gift } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Check, X, Users, GiftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AttendanceStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  gifts: Gift[];
  prevStep: () => void;
  nextStep: () => void;
};

export default function AttendanceStep({
  formData,
  setFormData,
  gifts,
  prevStep,
  nextStep,
}: AttendanceStepProps) {
  const handleSelectChange = (name: string, value: string) => {
    if (name === "selectedGift") {
      setFormData({
        ...formData,
        [name]: value === "none" ? null : Number.parseInt(value, 10),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <CardContent className="p-6 md:p-8">
      <div className="space-y-6">
        <div className="text-center mb-2">
          <h3 className="font-serif text-xl font-medium text-[#2D2D2D] mb-2">
            Will you be attending our wedding?
          </h3>
          <p className="text-muted-foreground text-sm">
            Please let us know if you&apos;ll be able to join us on our special
            day
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, attending: true })}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300",
              formData.attending === true
                ? "bg-[#D4B56A]/10 border-[#D4B56A] text-[#D4B56A]"
                : "bg-white border-[#D4B56A]/30 hover:border-[#D4B56A]/60"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                formData.attending === true
                  ? "bg-[#D4B56A] text-white"
                  : "bg-[#D4B56A]/10 text-[#D4B56A]"
              )}
            >
              <Check size={20} />
            </div>
            <span className="font-medium">Yes, I&apos;ll attend</span>
            <span className="text-xs text-muted-foreground mt-1">
              I wouldn&apos;t miss it!
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, attending: false })}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300",
              formData.attending === false
                ? "bg-gray-100 border-gray-300 text-gray-700"
                : "bg-white border-gray-200 hover:border-gray-300"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                formData.attending === false
                  ? "bg-gray-300 text-white"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              <X size={20} />
            </div>
            <span className="font-medium">Sorry, can&apos;t make it</span>
            <span className="text-xs text-muted-foreground mt-1">
              I&apos;ll be there in spirit
            </span>
          </button>
        </div>

        {formData.attending === true && (
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-2">
              <Label
                htmlFor="guestCount"
                className="text-[#2D2D2D] flex items-center"
              >
                <Users size={16} className="mr-2 text-[#D4B56A]" />
                Number of Guests (including yourself)
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("guestCount", value)
                }
                value={formData.guestCount.toString()}
              >
                <SelectTrigger
                  id="guestCount"
                  className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                >
                  <SelectValue placeholder="Select number of guests" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(6)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} {i === 1 ? "person" : "people"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Please include yourself in the guest count
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="selectedGift"
                className="text-[#2D2D2D] flex items-center"
              >
                <GiftIcon size={16} className="mr-2 text-[#D4B56A]" />
                Gift Selection{" "}
                <span className="text-muted-foreground font-normal ml-1">
                  (optional)
                </span>
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("selectedGift", value)
                }
                value={formData.selectedGift?.toString() || ""}
              >
                <SelectTrigger
                  id="selectedGift"
                  className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                >
                  <SelectValue placeholder="Select a gift (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No gift selection</SelectItem>
                  {gifts.map((gift) => (
                    <SelectItem key={gift.id} value={gift.id.toString()}>
                      {gift.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                You can select a gift from our registry or browse the full
                registry later
              </p>
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
            disabled={formData.attending === null}
            className="bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
