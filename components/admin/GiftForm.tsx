import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface GiftFormProps {
  onSubmit: () => void;
}

const GiftForm: React.FC<GiftFormProps> = ({ onSubmit }) => {
  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftImage, setNewGiftImage] = useState<File | null>(null);

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGiftName) {
      toast.error("Please enter a gift name");
      return;
    }

    const formData = new FormData();
    formData.append("name", newGiftName);
    if (newGiftImage) formData.append("image", newGiftImage);

    try {
      const response = await fetch("/api/add-gift", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setNewGiftName("");
        setNewGiftImage(null);
        onSubmit();
      }
    } catch (error) {
      toast.error("Failed to add gift");
    }
  };

  return (
    <form onSubmit={handleAddGift} className="space-y-4 mb-6">
      <Input
        placeholder="Gift name"
        value={newGiftName}
        onChange={(e) => setNewGiftName(e.target.value)}
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setNewGiftImage(e.target.files?.[0] || null)}
      />
      <Button type="submit">Add Gift</Button>
    </form>
  );
};

export default GiftForm;
