"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { addGift } from "@/app/actions/gifts";

interface GiftFormProps {
  onSubmit: () => void;
}

const GiftForm: React.FC<GiftFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await addGift(formData);
      toast.success(result.message);
      formRef.current?.reset();
      onSubmit();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add gift");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleSubmit(formData);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gift-name">Gift Name</Label>
        <Input
          id="gift-name"
          name="name"
          placeholder="Enter gift name"
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gift-image">Gift Image</Label>
        <Input
          id="gift-image"
          name="image"
          type="file"
          accept="image/*"
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <Button
        type="submit"
        className="bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
        disabled={isLoading}
      >
        {isLoading ? (
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
            Adding Gift...
          </span>
        ) : (
          "Add Gift"
        )}
      </Button>
    </form>
  );
};

export default GiftForm;