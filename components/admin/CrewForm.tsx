import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface CrewFormProps {
  onSubmit: () => void;
}

const CrewForm: React.FC<CrewFormProps> = ({ onSubmit }) => {
  const [newCrewName, setNewCrewName] = useState("");
  const [newCrewRole, setNewCrewRole] = useState("");
  const [newCrewHeadshot, setNewCrewHeadshot] = useState<File | null>(null);
  const [newCrewQuote, setNewCrewQuote] = useState("");

  const handleAddCrewMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCrewName || !newCrewRole) {
      toast.error("Please enter a name and role for the crew member");
      return;
    }

    let headshot_url = null;

    if (newCrewHeadshot) {
      try {
        const { data, error } = await supabase.storage
          .from("crew-headshots")
          .upload(`${Date.now()}-${newCrewHeadshot.name}`, newCrewHeadshot);

        if (error) {
          toast.error("Failed to upload headshot: " + error.message);
          return;
        }

        headshot_url = supabase.storage
          .from("crew-headshots")
          .getPublicUrl(data.path).data.publicUrl;
      } catch (error) {
        toast.error("Failed to upload headshot");
        return;
      }
    }

    try {
      const { error } = await supabase.from("bridal_crew").insert({
        name: newCrewName,
        role: newCrewRole,
        headshot_url,
        quote: newCrewQuote || null,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Crew member added successfully!");
        setNewCrewName("");
        setNewCrewRole("");
        setNewCrewHeadshot(null);
        setNewCrewQuote("");
        onSubmit();
      }
    } catch (error) {
      toast.error("Failed to add crew member");
    }
  };

  return (
    <form onSubmit={handleAddCrewMember} className="space-y-4 mb-6">
      <Input
        placeholder="Crew member name"
        value={newCrewName}
        onChange={(e) => setNewCrewName(e.target.value)}
      />
      <Input
        placeholder="Role (e.g., Bridesmaid, Groomsman)"
        value={newCrewRole}
        onChange={(e) => setNewCrewRole(e.target.value)}
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setNewCrewHeadshot(e.target.files?.[0] || null)}
      />
      <Input
        placeholder="Quote (optional)"
        value={newCrewQuote}
        onChange={(e) => setNewCrewQuote(e.target.value)}
      />
      <Button type="submit">Add Crew Member</Button>
    </form>
  );
};

export default CrewForm;
