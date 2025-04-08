"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { deleteRSVP } from "@/app/actions/rsvp";
import { deleteGift } from "@/app/actions/gifts";
import { deleteCrewMember } from "@/app/actions/crew";
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
import {
  Trash,
  Users,
  Check,
  Gift,
  Heart,
  UserRound,
  Search,
  Download,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import RSVPTable from "@/components/admin/RSVPTable";
import GiftForm from "@/components/admin/GiftForm";
import CrewForm from "@/components/admin/CrewForm";
import EditRSVPForm from "@/components/admin/EditRSVPForm";
import { Input } from "@/components/ui/input";

import type {
  RSVP,
  Gift as GiftType,
  CrewMember,
  Profile,
} from "@/types/admin";

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [filteredRsvps, setFilteredRsvps] = useState<RSVP[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [editRSVP, setEditRSVP] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRsvps(rsvps);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredRsvps(
        rsvps.filter((rsvp) => {
          const name = profiles[rsvp.id] || "";
          const additionalGuestsString =
            rsvp.additional_guests
              ?.map((guest) => `${guest.full_name} ${guest.surname}`)
              .join(", ")
              .toLowerCase() || "";
          return (
            name.toLowerCase().includes(lowercasedSearch) ||
            rsvp.dietary_restrictions
              ?.toLowerCase()
              .includes(lowercasedSearch) ||
            rsvp.song_request?.toLowerCase().includes(lowercasedSearch) ||
            additionalGuestsString.includes(lowercasedSearch)
          );
        })
      );
    }
  }, [searchTerm, rsvps, profiles]);

  const checkAuth = async () => {
    setLoading(true);
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      router.replace("/");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", session.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      router.replace("/rsvp");
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const [rsvpResult, giftResult, crewResult, profileResult] =
      await Promise.all([
        supabase.from("rsvp").select("*, additional_guests"),
        supabase
          .from("gifts")
          .select("id, name, available, claimed_by, image_url"),
        supabase
          .from("bridal_crew")
          .select("id, name, role, headshot_url, quote"),
        supabase.from("profiles").select("id, full_name"),
      ]);

    if (rsvpResult.error) toast.error(rsvpResult.error.message);
    else {
      const transformedRsvps = rsvpResult.data || [];
      setRsvps(transformedRsvps);
      setFilteredRsvps(transformedRsvps);
    }

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
    setLoading(false);
  };

  const handleDeleteGift = async (giftId: number) => {
    try {
      const result = await deleteGift(giftId);
      toast.success(result.message);
      fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete gift");
    }
  };

  const handleDeleteCrewMember = async (crewId: number) => {
    try {
      const result = await deleteCrewMember(crewId);
      toast.success(result.message);
      fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete crew member");
    }
  };

  const handleDeleteRSVP = async (rsvpId: string) => {
    try {
      const result = await deleteRSVP(rsvpId);
      toast.success(result.message);
      fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete RSVP");
    }
  };

  const exportToCSV = () => {
    let csvContent =
      "Name,Attending,Guests,Additional Guests,Dietary Restrictions,Song Request\n";

    rsvps.forEach((rsvp) => {
      const name = profiles[rsvp.id] || "Unknown";
      const attending = rsvp.attending ? "Yes" : "No";
      const additional_guests =
        rsvp.additional_guests
          ?.map((guest) => `${guest.full_name} ${guest.surname}`)
          .join("; ") || "None";
      const row = [
        name,
        attending,
        rsvp.guest_count,
        additional_guests,
        rsvp.dietary_restrictions || "None",
        rsvp.song_request || "None",
      ]
        .map((cell) => `"${cell}"`)
        .join(",");

      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "wedding_rsvps.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="mt-20 min-h-screen bg-[#FDFBF7]" ref={ref}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-serif text-3xl font-semibold text-[#2D2D2D] mb-2">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage your wedding details and guest information
          </p>
        </motion.div>

        <Tabs defaultValue="rsvps" className="space-y-8">
          <TabsList className="bg-white border border-[#D4B56A]/20 p-1">
            <TabsTrigger
              value="rsvps"
              className="data-[state=active]:bg-[#D4B56A]/10 data-[state=active]:text-[#D4B56A] data-[state=active]:shadow-none"
            >
              <UserRound className="h-4 w-4 mr-2" />
              RSVPs
            </TabsTrigger>
            <TabsTrigger
              value="gifts"
              className="data-[state=active]:bg-[#D4B56A]/10 data-[state=active]:text-[#D4B56A] data-[state=active]:shadow-none"
            >
              <Gift className="h-4 w-4 mr-2" />
              Gift Registry
            </TabsTrigger>
            <TabsTrigger
              value="crew"
              className="data-[state=active]:bg-[#D4B56A]/10 data-[state=active]:text-[#D4B56A] data-[state=active]:shadow-none"
            >
              <Heart className="h-4 w-4 mr-2" />
              Bridal Crew
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rsvps" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <StatsCard {...stat} />
                </motion.div>
              ))}
            </div>

            <motion.div
              custom={3}
              variants={fadeInUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md overflow-hidden">
                <div className="bg-white p-4 border-b border-[#D4B56A]/10 flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      placeholder="Search RSVPs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="border-[#D4B56A]/30 text-[#D4B56A] hover:bg-[#D4B56A]/10 hover:text-[#D4B56A]"
                    onClick={exportToCSV}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Dialog
                    open={!!editRSVP}
                    onOpenChange={(open) => !open && setEditRSVP(null)}
                  >
                    <RSVPTable
                      rsvps={filteredRsvps}
                      profiles={profiles}
                      onEdit={(rsvp) => setEditRSVP(rsvp)}
                      onDelete={handleDeleteRSVP}
                      loading={loading}
                    />
                    <DialogContent className="bg-white border-[#D4B56A]/20">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-xl text-[#2D2D2D]">
                          Edit RSVP
                        </DialogTitle>
                      </DialogHeader>
                      {editRSVP && (
                        <EditRSVPForm
                          rsvp={editRSVP}
                          onSubmit={async (updatedRSVP) => {
                            const { error } = await supabase
                              .from("rsvp")
                              .update({
                                ...updatedRSVP,
                                additional_guests:
                                  updatedRSVP.additional_guests,
                              })
                              .eq("id", updatedRSVP.id);

                            if (error) toast.error(error.message);
                            else {
                              toast.success("RSVP updated successfully!");
                              setEditRSVP(null);
                              fetchData();
                            }
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="gifts" className="space-y-6">
            <motion.div
              custom={0}
              variants={fadeInUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md overflow-hidden">
                <div className="bg-white p-6 border-b border-[#D4B56A]/10">
                  <h3 className="font-serif text-xl font-semibold text-[#2D2D2D] mb-4">
                    Add Gift
                  </h3>
                  <GiftForm onSubmit={fetchData} />
                </div>
              </Card>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeInUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-white p-4 border-b border-[#D4B56A]/10">
                    <h3 className="font-serif text-xl font-semibold text-[#2D2D2D]">
                      Gift Registry
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your wedding gifts
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#FDFBF7]">
                        <TableRow className="border-b border-[#D4B56A]/10 hover:bg-[#FDFBF7]">
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Gift Name
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Available
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Claimed By
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Image
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Loading gifts...
                            </TableCell>
                          </TableRow>
                        ) : gifts.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No gifts added yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          gifts.map((gift) => (
                            <TableRow
                              key={gift.id}
                              className="border-b border-[#D4B56A]/10 hover:bg-[#FDFBF7]/50"
                            >
                              <TableCell className="font-medium">
                                {gift.name}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    gift.available
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {gift.available ? "Available" : "Claimed"}
                                </span>
                              </TableCell>
                              <TableCell>
                                {gift.claimed_by
                                  ? profiles[gift.claimed_by] || gift.claimed_by
                                  : "—"}
                              </TableCell>
                              <TableCell>
                                {gift.image_url ? (
                                  <div className="w-12 h-12 rounded-md overflow-hidden border border-[#D4B56A]/20">
                                    <img
                                      src={gift.image_url || "/placeholder.svg"}
                                      alt={gift.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
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
                                  className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="crew" className="space-y-6">
            <motion.div
              custom={0}
              variants={fadeInUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md overflow-hidden">
                <div className="bg-white p-6 border-b border-[#D4B56A]/10">
                  <h3 className="font-serif text-xl font-semibold text-[#2D2D2D] mb-4">
                    Add Crew Member
                  </h3>
                  <CrewForm onSubmit={fetchData} />
                </div>
              </Card>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeInUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-white p-4 border-b border-[#D4B56A]/10">
                    <h3 className="font-serif text-xl font-semibold text-[#2D2D2D]">
                      Bridal Crew
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your wedding party
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#FDFBF7]">
                        <TableRow className="border-b border-[#D4B56A]/10 hover:bg-[#FDFBF7]">
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Name
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Role
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Headshot
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Quote
                          </TableHead>
                          <TableHead className="text-[#2D2D2D] font-medium">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Loading crew members...
                            </TableCell>
                          </TableRow>
                        ) : crew.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No crew members added yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          crew.map((member) => (
                            <TableRow
                              key={member.id}
                              className="border-b border-[#D4B56A]/10 hover:bg-[#FDFBF7]/50"
                            >
                              <TableCell className="font-medium">
                                {member.name}
                              </TableCell>
                              <TableCell>
                                <span className="px-2 py-1 rounded-full text-xs bg-[#D4B56A]/10 text-[#D4B56A]">
                                  {member.role}
                                </span>
                              </TableCell>
                              <TableCell>
                                {member.headshot_url ? (
                                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4B56A]/20">
                                    <img
                                      src={
                                        member.headshot_url ||
                                        "/placeholder.svg"
                                      }
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  "No image"
                                )}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {member.quote || "—"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteCrewMember(member.id)
                                  }
                                  className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
