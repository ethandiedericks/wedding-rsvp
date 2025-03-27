"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RSVP {
  id: string;
  attending: boolean;
  guest_count: number;
  party_choice: "bachelor" | "bachelorette" | "none";
  gender: "male" | "female";
  dietary_restrictions: string | null;
  song_request: string | null;
}

interface Gift {
  id: number;
  name: string;
  available: boolean;
  claimed_by: string | null;
  image_url: string | null;
  estimated_price: number | null;
}

interface Profile {
  id: string;
  full_name: string | null;
}

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({}); // Map of user_id -> full_name
  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftImage, setNewGiftImage] = useState<File | null>(null);
  const [newGiftPrice, setNewGiftPrice] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error("No session, redirecting to /auth/signin");
        router.replace("/auth/signin");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        console.error("Not an admin, redirecting to /rsvp");
        router.replace("/rsvp");
        return;
      }

      fetchData();
    };
    checkAuth();
  }, [router]);

  const fetchData = async () => {
    // Fetch RSVPs
    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvp")
      .select("*");
    if (rsvpError) {
      toast.error(rsvpError.message);
    } else {
      setRsvps(rsvpData || []);
    }

    // Fetch Gifts
    const { data: giftData, error: giftError } = await supabase
      .from("gifts")
      .select("*");
    if (giftError) {
      toast.error(giftError.message);
    } else {
      setGifts(giftData || []);
    }

    // Fetch Profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name");
    if (profileError) {
      toast.error(profileError.message);
    } else {
      const profileMap = (profileData || []).reduce((acc, profile: Profile) => {
        acc[profile.id] = profile.full_name || "Unknown";
        return acc;
      }, {} as Record<string, string>);
      setProfiles(profileMap);
    }
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftName) {
      toast.error("Please enter a gift name");
      return;
    }
    if (
      !newGiftPrice ||
      isNaN(Number(newGiftPrice)) ||
      Number(newGiftPrice) < 0
    ) {
      toast.error("Please enter a valid estimated price");
      return;
    }

    const formData = new FormData();
    formData.append("name", newGiftName);
    formData.append("estimated_price", newGiftPrice);
    if (newGiftImage) {
      formData.append("image", newGiftImage);
    }

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
      setNewGiftPrice("");
      fetchData();
    }
  };

  const handleDeleteGift = async (giftId: number) => {
    const { error } = await supabase.from("gifts").delete().eq("id", giftId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Gift deleted successfully!");
      fetchData();
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl mb-4">RSVP Responses</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Attending</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Party Choice</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Dietary Restrictions</TableHead>
                <TableHead>Song Request</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell>{profiles[rsvp.id] || rsvp.id}</TableCell>
                  <TableCell>{rsvp.attending ? "Yes" : "No"}</TableCell>
                  <TableCell>{rsvp.guest_count}</TableCell>
                  <TableCell>{rsvp.party_choice}</TableCell>
                  <TableCell>{rsvp.gender}</TableCell>
                  <TableCell>{rsvp.dietary_restrictions || "None"}</TableCell>
                  <TableCell>{rsvp.song_request || "None"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h2 className="text-xl mt-6 mb-4">Gift Registry</h2>
          <form onSubmit={handleAddGift} className="space-y-4 mb-4">
            <Input
              placeholder="Gift name"
              value={newGiftName}
              onChange={(e) => setNewGiftName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Estimated price (R)"
              value={newGiftPrice}
              onChange={(e) => setNewGiftPrice(e.target.value)}
              min="0"
              step="0.01"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewGiftImage(e.target.files?.[0] || null)}
            />
            <Button type="submit">Add Gift</Button>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gift Name</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Claimed By</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Price (R)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gifts.map((gift) => (
                <TableRow key={gift.id}>
                  <TableCell>{gift.name}</TableCell>
                  <TableCell>{gift.available ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {gift.claimed_by
                      ? profiles[gift.claimed_by] || gift.claimed_by
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {gift.image_url ? (
                      <img
                        src={gift.image_url}
                        alt={gift.name}
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      "No image"
                    )}
                  </TableCell>
                  <TableCell>
                    {gift.estimated_price
                      ? `R${gift.estimated_price.toFixed(2)}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteGift(gift.id)}
                      disabled={!gift.available}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
