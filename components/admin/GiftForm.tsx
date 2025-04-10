"use client";

import React, { useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { addGift } from "@/app/actions/actions";

interface GiftFormProps {
  onSubmit: (newGift: any) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
      disabled={pending}
    >
      {pending ? (
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
  );
}

const GiftForm: React.FC<GiftFormProps> = ({ onSubmit }) => {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    try {
      const newGift = await addGift(
        formData.get("name") as string,
        formData.get("image") as File || null
      );
      toast.success("Gift added successfully!");
      formRef.current?.reset();
      onSubmit(newGift);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add gift");
      }
    }
  }

  return (
    <form action={clientAction} ref={formRef} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Gift Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter gift name"
          required
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Gift Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <SubmitButton />
    </form>
  );
};

export default GiftForm;
