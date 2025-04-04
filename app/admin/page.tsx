"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, Users, Check } from "lucide-react";

// Define types in separate file and import them
import { RSVP, Gift, CrewMember, Profile } from "@/types/admin";

// Extract components to separate files
import StatsCard from "@/components/admin/StatsCard";
import RSVPTable from "@/components/admin/RSVPTable";
import GiftForm from "@/components/admin/GiftForm";
import CrewForm from "@/components/admin/CrewForm";
import EditRSVPForm from "@/components/admin/EditRSVPForm";

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [editRSVP, setEditRSVP] = useState<RSVP | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      router.replace("/auth/signin");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      router.replace("/rsvp");
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    // Fetch all data in parallel
    const [rsvpResult, giftResult, crewResult, profileResult] =
      await Promise.all([
        supabase.from("rsvp").select("*"),
        supabase
          .from("gifts")
          .select("id, name, available, claimed_by, image_url"),
        supabase
          .from("bridal_crew")
          .select("id, name, role, headshot_url, quote"),
        supabase.from("profiles").select("id, full_name"),
      ]);

    if (rsvpResult.error) toast.error(rsvpResult.error.message);
    else setRsvps(rsvpResult.data || []);

    if (giftResult.error) toast.error(giftResult.error.message);
    else setGifts(giftResult.data || []);

    if (crewResult.error) toast.error(crewResult.error.message);
    else setCrew(crewResult.data || []);

    if (profileResult.error) toast.error(profileResult.error.message);
    else {
      const profileMap = (profileResult.data || []).reduce(
        (acc, profile: Profile) => {
          acc[profile.id] = profile.full_name || "Unknown";
          return acc;
        },
        {} as Record<string, string>
      );
      setProfiles(profileMap);
    }
  };

  const handleDeleteGift = async (giftId: number) => {
    const { error } = await supabase.from("gifts").delete().eq("id", giftId);
    if (error) toast.error(error.message);
    else {
      toast.success("Gift deleted successfully!");
      fetchData();
    }
  };

  const handleDeleteCrewMember = async (crewId: number) => {
    const { error } = await supabase
      .from("bridal_crew")
      .delete()
      .eq("id", crewId);
    if (error) toast.error(error.message);
    else {
      toast.success("Crew member deleted successfully!");
      fetchData();
    }
  };

  const handleDeleteRSVP = async (rsvpId: string) => {
    const { error } = await supabase.from("rsvp").delete().eq("id", rsvpId);
    if (error) toast.error(error.message);
    else {
      toast.success("RSVP deleted successfully!");
      fetchData();
    }
  };

  // Calculate stats once
  const totalRSVPs = rsvps.length;
  const attendingCount = rsvps.filter((rsvp) => rsvp.attending).length;
  const totalGuests = rsvps.reduce((sum, rsvp) => sum + rsvp.guest_count, 0);
  const stats = [
    {
      title: "Total RSVPs",
      value: totalRSVPs,
      label: "Responses received",
      icon: Users,
    },
    {
      title: "Attending",
      value: attendingCount,
      label: `${
        Math.round((attendingCount / totalRSVPs) * 100) || 0
      }% of total`,
      icon: Check,
    },
    {
      title: "Total Guests",
      value: totalGuests,
      label: "Across all RSVPs",
      icon: Users,
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8 ">
      <div className="p-6 border rounded-2xl space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Tabs defaultValue="rsvps" className="space-y-6 ">
          <TabsList>
            <TabsTrigger value="rsvps" className="hover:cursor-pointer">
              RSVPs
            </TabsTrigger>
            <TabsTrigger value="gifts" className="hover:cursor-pointer">
              Gift Registry
            </TabsTrigger>
            <TabsTrigger value="crew" className="hover:cursor-pointer">
              Bridal Crew
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rsvps">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, i) => (
                <StatsCard key={i} {...stat} />
              ))}
            </div>
            <div className="border rounded-xl p-4">
              {/* Pass the Dialog into RSVPTable or handle it here */}
              <Dialog
                open={!!editRSVP}
                onOpenChange={(open) => !open && setEditRSVP(null)}
              >
                <RSVPTable
                  rsvps={rsvps}
                  profiles={profiles}
                  onEdit={(rsvp) => setEditRSVP(rsvp)} // This sets the RSVP to edit and opens the dialog
                  onDelete={handleDeleteRSVP}
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit RSVP</DialogTitle>
                  </DialogHeader>
                  {editRSVP && (
                    <EditRSVPForm
                      rsvp={editRSVP}
                      onSubmit={async (updatedRSVP) => {
                        const { error } = await supabase
                          .from("rsvp")
                          .update(updatedRSVP)
                          .eq("id", updatedRSVP.id);

                        if (error) toast.error(error.message);
                        else {
                          toast.success("RSVP updated successfully!");
                          setEditRSVP(null); // Close the dialog
                          fetchData();
                        }
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="gifts" className="space-y-6">
            <Card>
              <div className="tracking-tight text-2xl font-medium pl-7">
                Add Gift
              </div>
              <CardContent className="pt-2">
                <GiftForm onSubmit={fetchData} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gift Name</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Claimed By</TableHead>
                      <TableHead>Image</TableHead>
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
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteGift(gift.id)}
                            disabled={!gift.available}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crew" className="space-y-6">
            <Card>
              <div className="tracking-tight text-2xl font-medium pl-7">
                Add Crew Member
              </div>
              <CardContent className="pt-2">
                <CrewForm onSubmit={fetchData} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Headshot</TableHead>
                      <TableHead>Quote</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crew.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          {member.headshot_url ? (
                            <img
                              src={member.headshot_url}
                              alt={member.name}
                              className="w-12 h-12 object-cover"
                            />
                          ) : (
                            "No image"
                          )}
                        </TableCell>
                        <TableCell>{member.quote || "N/A"}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCrewMember(member.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
