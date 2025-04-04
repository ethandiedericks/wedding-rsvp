import React, { useState } from "react";
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
import { RSVP } from "@/types/admin";

interface EditRSVPFormProps {
  rsvp: RSVP;
  onSubmit: (updatedRSVP: RSVP) => void;
}

const EditRSVPForm: React.FC<EditRSVPFormProps> = ({ rsvp, onSubmit }) => {
  const [editedRSVP, setEditedRSVP] = useState<RSVP>({ ...rsvp });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedRSVP);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="attending" className="cursor-pointer">
          Attending
        </Label>
        <Checkbox
          id="attending"
          checked={editedRSVP.attending}
          onCheckedChange={(checked) =>
            setEditedRSVP({
              ...editedRSVP,
              attending: !!checked,
            })
          }
        />
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
              guest_count: parseInt(e.target.value) || 0,
            })
          }
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
          <SelectTrigger id="party-choice">
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
          <SelectTrigger id="gender">
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
        />
      </div>

      <Button type="submit">Save Changes</Button>
    </form>
  );
};

export default EditRSVPForm;
