"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RSVP() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [gifts, setGifts] = useState<
    { id: number; name: string; available: boolean }[]
  >([]);
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [partyChoice, setPartyChoice] = useState<
    "bachelor" | "bachelorette" | "none"
  >("none");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [songRequest, setSongRequest] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.error("No active session:", sessionError);
          router.replace("/auth/signin");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profileData) {
          console.error("No profile found:", profileError);
          router.replace("/auth/signin");
          return;
        }

        fetchGifts();
      } catch (catchError) {
        console.error("Unexpected error during auth check:", catchError);
        router.replace("/auth/signin");
      }
    };

    checkAuth();
  }, [router]);

  const fetchGifts = async () => {
    const { data, error } = await supabase
      .from("gifts")
      .select("id, name, available")
      .eq("available", true);
    if (error) {
      console.error("Error fetching gifts:", error);
    } else {
      setGifts(data || []);
      console.log("Gifts fetched:", data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      toast.error("You must be logged in to RSVP");
      router.replace("/auth/signin");
      return;
    }

    if (attending === null || !gender) {
      toast.error("Please complete all required fields");
      return;
    }

    if (selectedGift) {
      const { data: giftCheck, error: giftCheckError } = await supabase
        .from("gifts")
        .select("available")
        .eq("id", selectedGift)
        .single();

      if (giftCheckError || !giftCheck) {
        toast.error("Error verifying gift availability");
        return;
      }

      if (!giftCheck.available) {
        toast.error("This gift has already been reserved by someone else");
        fetchGifts();
        return;
      }
    }

    const { error: rsvpError } = await supabase.from("rsvp").upsert({
      id: session.user.id,
      attending,
      guest_count: attending ? guestCount : 0,
      party_choice: attending && partyChoice !== "none" ? partyChoice : "none",
      gender,
      dietary_restrictions: dietaryRestrictions || null,
      song_request: songRequest || null,
    });

    if (rsvpError) {
      toast.error(rsvpError.message);
      return;
    }

    if (selectedGift) {
      const { error: giftError } = await supabase
        .from("gifts")
        .update({ available: false, claimed_by: session.user.id })
        .eq("id", selectedGift)
        .eq("available", true);

      if (giftError) {
        toast.error("Failed to claim gift: " + giftError.message);
        return;
      }
      fetchGifts();
      setSelectedGift(null);
    }

    toast.success("RSVP submitted successfully!");
    if (partyChoice !== "none") {
      const whatsappLink =
        partyChoice === "bachelor"
          ? "https://chat.whatsapp.com/bachelor-group-link"
          : "https://chat.whatsapp.com/bachelorette-group-link";
      window.open(whatsappLink, "_blank");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>RSVP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p>Are you attending?</p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={attending === true ? "default" : "outline"}
                  onClick={() => setAttending(true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={attending === false ? "default" : "outline"}
                  onClick={() => setAttending(false)}
                >
                  No
                </Button>
              </div>
            </div>

            {attending && (
              <>
                <Input
                  type="number"
                  placeholder="Number of additional guests"
                  value={guestCount}
                  onChange={(e) =>
                    setGuestCount(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  min="0"
                />
                <Select
                  onValueChange={(value) =>
                    setSelectedGift(parseInt(value) || null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gift (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {gifts.map((gift) => (
                      <SelectItem key={gift.id} value={gift.id.toString()}>
                        {gift.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value: "male" | "female") => setGender(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {gender && (
                  <Select
                    onValueChange={(
                      value: "bachelor" | "bachelorette" | "none"
                    ) => setPartyChoice(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Join a party?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No thanks</SelectItem>
                      {gender === "male" && (
                        <SelectItem value="bachelor">Bachelor Party</SelectItem>
                      )}
                      {gender === "female" && (
                        <SelectItem value="bachelorette">
                          Bachelorette Party
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
                <Textarea
                  placeholder="Any dietary restrictions? (e.g., vegetarian, gluten-free)"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                />
                <Input
                  placeholder="Song request (optional)"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                />
              </>
            )}
            <Button type="submit" className="w-full">
              Submit RSVP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
