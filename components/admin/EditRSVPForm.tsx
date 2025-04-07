"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RSVP } from "@/types/admin";

interface EditRSVPFormProps {
  rsvp: RSVP;
  onSubmit: (updatedRSVP: RSVP) => void;
}

const EditRSVPForm: React.FC<EditRSVPFormProps> = ({ rsvp, onSubmit }) => {
  const [editedRSVP, setEditedRSVP] = useState<RSVP>({ ...rsvp });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit(editedRSVP);
    // Note: The loading state will be reset when the dialog closes
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="attending"
          checked={editedRSVP.attending}
          onCheckedChange={(checked) =>
            setEditedRSVP({
              ...editedRSVP,
              attending: !!checked,
            })
          }
          className="border-[#D4B56A]/30 data-[state=checked]:bg-[#D4B56A] data-[state=checked]:border-[#D4B56A]"
        />
        <Label htmlFor="attending" className="cursor-pointer">
          Attending
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guest-count">Guest Count</Label>
        <Input
          id="guest-count"
          type="number"
          min="0"
          value={editedRSVP.guest_count}
          onChange={(e) =>
            setEditedRSVP({
              ...editedRSVP,
              guest_count: Number.parseInt(e.target.value) || 0,
            })
          }
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="party-choice">Party Choice</Label>
        <Select
          value={editedRSVP.party_choice}
          onValueChange={(value) =>
            setEditedRSVP({
              ...editedRSVP,
              party_choice: value as RSVP["party_choice"],
            })
          }
        >
          <SelectTrigger
            id="party-choice"
            className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
          >
            <SelectValue placeholder="Select party" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="bachelor">Bachelor</SelectItem>
            <SelectItem value="bachelorette">Bachelorette</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={editedRSVP.gender}
          onValueChange={(value) =>
            setEditedRSVP({
              ...editedRSVP,
              gender: value as RSVP["gender"],
            })
          }
        >
          <SelectTrigger
            id="gender"
            className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
          >
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietary">Dietary Restrictions</Label>
        <Input
          id="dietary"
          value={editedRSVP.dietary_restrictions || ""}
          onChange={(e) =>
            setEditedRSVP({
              ...editedRSVP,
              dietary_restrictions: e.target.value || null,
            })
          }
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="song">Song Request</Label>
        <Input
          id="song"
          value={editedRSVP.song_request || ""}
          onChange={(e) =>
            setEditedRSVP({
              ...editedRSVP,
              song_request: e.target.value || null,
            })
          }
          className="border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
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
            Saving Changes...
          </span>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default EditRSVPForm;
