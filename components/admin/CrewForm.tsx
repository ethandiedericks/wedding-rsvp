"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addCrewMember } from "@/app/actions/actions";

interface CrewFormProps {
  onSubmit: () => void;
}

const CrewForm: React.FC<CrewFormProps> = ({ onSubmit }) => {
  const [newCrewName, setNewCrewName] = useState("");
  const [newCrewRole, setNewCrewRole] = useState("");
  const [newCrewHeadshot, setNewCrewHeadshot] = useState<File | null>(null);
  const [newCrewQuote, setNewCrewQuote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCrewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newCrewName || !newCrewRole) {
      toast.error("Please enter a name and role for the crew member");
      setIsLoading(false);
      return;
    }

    try {
      await addCrewMember(newCrewName, newCrewRole, newCrewHeadshot, newCrewQuote);
      toast.success("Crew member added successfully!");
      setNewCrewName("");
      setNewCrewRole("");
      setNewCrewHeadshot(null);
      setNewCrewQuote("");
      onSubmit();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add crew member");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddCrewMember} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="crew-name">Name</Label>
        <Input
          id="crew-name"
          placeholder="Enter crew member name"
          value={newCrewName}
          onChange={(e) => setNewCrewName(e.target.value)}
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="crew-role">Role</Label>
        <Input
          id="crew-role"
          placeholder="e.g., Bridesmaid, Groomsman"
          value={newCrewRole}
          onChange={(e) => setNewCrewRole(e.target.value)}
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="crew-headshot">Headshot</Label>
        <Input
          id="crew-headshot"
          type="file"
          accept="image/*"
          onChange={(e) => setNewCrewHeadshot(e.target.files?.[0] || null)}
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="crew-quote">Quote (optional)</Label>
        <Textarea
          id="crew-quote"
          placeholder="Enter a memorable quote"
          value={newCrewQuote}
          onChange={(e) => setNewCrewQuote(e.target.value)}
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
            Adding Crew Member...
          </span>
        ) : (
          "Add Crew Member"
        )}
      </Button>
    </form>
  );
};

export default CrewForm;
