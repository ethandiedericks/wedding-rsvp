"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";
import { Input } from "@/components/ui/input";

import type {
  RSVP,
  Gift as GiftType,
  CrewMember,
  Profile,
} from "@/types/admin";

import { 
  checkAuth,
  deleteCrewMember,
  deleteGift,
  deleteRSVP,
  fetchCrew,
  fetchGifts,
  fetchProfiles,
  fetchRSVPs,
  updateRSVP
} from "@/app/actions/actions";

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [filteredRsvps, setFilteredRsvps] = useState<RSVP[]>([]);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editRSVP, setEditRSVP] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rsvps");

  const router = useRouter();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    verifyAuth();
    // Initial data fetch for all tabs
    const initialFetch = async () => {
      try {
        const [profilesData, rsvpsData, giftsData, crewData] = await Promise.all([
          fetchProfiles(),
          fetchRSVPs(),
          fetchGifts(),
          fetchCrew()
        ]);

        const profileMap = profilesData.reduce(
          (acc, profile: Profile) => {
            acc[profile.id] = profile.full_name || "Unknown";
            return acc;
          },
          {} as Record<string, string>
        );

        setProfiles(profileMap);
        setRsvps(rsvpsData);
        setFilteredRsvps(rsvpsData);
        setGifts(giftsData);
        setCrew(crewData);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, [router]);

  // No need for this effect anymore as we fetch all data initially

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredRsvps(
        rsvps.filter((rsvp) => {
          const name = profiles[rsvp.id] || "";
          const additionalGuestsString =
            rsvp.additional_guests
              ?.map((guest) => `${guest.full_name} ${guest.surname}`)
              .join(" ") || "";
          return (
            name.toLowerCase().includes(lowercasedSearch) ||
            additionalGuestsString.toLowerCase().includes(lowercasedSearch)
          );
        })
      );
    } else {
      setFilteredRsvps(rsvps);
    }
  }, [searchTerm, rsvps, profiles]);

  const verifyAuth = async () => {
    setLoading(true);
    try {
      await checkAuth();
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      router.replace("/rsvp");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profilesData, rsvpsData, giftsData, crewData] = await Promise.all([
        fetchProfiles(),
        fetchRSVPs(),
        fetchGifts(),
        fetchCrew()
      ]);

      const profileMap = profilesData.reduce(
        (acc, profile: Profile) => {
          acc[profile.id] = profile.full_name || "Unknown";
          return acc;
        },
        {} as Record<string, string>
      );

      setProfiles(profileMap);
      setRsvps(rsvpsData);
      setFilteredRsvps(rsvpsData);
      setGifts(giftsData);
      setCrew(crewData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGift = async (giftId: number) => {
    try {
      await deleteGift(giftId);
      toast.success("Gift deleted successfully!");
      // Update local state instead of fetching all data
      setGifts(prev => prev.filter(gift => gift.id !== giftId));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete gift");
      }
    }
  };

  const handleDeleteCrewMember = async (crewId: number) => {
    try {
      await deleteCrewMember(crewId);
      toast.success("Crew member deleted successfully!");
      // Update local state instead of fetching all data
      setCrew(prev => prev.filter(member => member.id !== crewId));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete crew member");
      }
    }
  };

  const handleDeleteRSVP = async (rsvpId: string) => {
    try {
      await deleteRSVP(rsvpId);
      toast.success("RSVP deleted successfully!");
      // Update local state instead of fetching all data
      setRsvps(prev => {
        const newRsvps = prev.filter(rsvp => rsvp.id !== rsvpId);
        setFilteredRsvps(newRsvps);
        return newRsvps;
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete RSVP");
      }
    }
  };

  const handleUpdateRSVP = async (updatedRSVP: RSVP) => {
    try {
      await updateRSVP(updatedRSVP);
      toast.success("RSVP updated successfully!");
      setEditRSVP(null);
      // Update local state instead of fetching all data
      setRsvps(prev => {
        const newRsvps = prev.map(rsvp => rsvp.id === updatedRSVP.id ? updatedRSVP : rsvp);
        setFilteredRsvps(newRsvps);
        return newRsvps;
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update RSVP");
      }
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
          .join(", ") || "";

      csvContent += `"${name}","${attending}","${rsvp.guest_count}","${additional_guests}","${rsvp.dietary_restrictions || ""}","${rsvp.song_request || ""}"\n`;
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
                    className="flex items-center gap-2"
                    onClick={() => {
                      const csvContent =
                        "data:text/csv;charset=utf-8," +
                        "Name,Attending,Guest Count,Dietary Restrictions,Song Request\n" +
                        filteredRsvps
                          .map(
                            (rsvp) =>
                              `${profiles[rsvp.id] || "Unknown"},${rsvp.attending ? "Yes" : "No"},${rsvp.guest_count},"${rsvp.dietary_restrictions || ""}","${rsvp.song_request || ""}"`
                          )
                          .join("\n");

                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "rsvps.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download size={18} />
                    Export CSV
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Dialog
                    open={!!editRSVP}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditRSVP(null);
                      }
                    }}
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
                      <EditRSVPForm
                        rsvp={editRSVP!}
                        onSubmit={async (updatedRSVP) => {
                          try {
                            await updateRSVP(updatedRSVP);
                            toast.success("RSVP updated successfully!");
                            setEditRSVP(null);
                            fetchData();
                          } catch (error) {
                            if (error instanceof Error) {
                              toast.error(error.message);
                            } else {
                              toast.error("Failed to update RSVP");
                            }
                          }
                        }}
                      />
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
                  <GiftForm onSubmit={(newGift) => setGifts(prev => [newGift, ...prev])} />
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
                                <DeleteConfirmation
                                  itemType="Gift"
                                  itemName={gift.name}
                                  onDelete={() => handleDeleteGift(gift.id)}
                                  disabled={!gift.available}
                                />
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
                  <CrewForm onSubmit={(newCrewMember) => setCrew(prev => [newCrewMember, ...prev])} />
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
                                <DeleteConfirmation
                                  itemType="Crew Member"
                                  itemName={member.name}
                                  onDelete={() => handleDeleteCrewMember(member.id)}
                                />
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
