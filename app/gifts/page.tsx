"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Heart, Gift, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllGifts } from "@/app/actions/actions";

interface GiftItem {
  id: number;
  name: string;
  available: boolean;
  claimed_by: string | null;
  image_url: string | null;
}

export default function GiftRegistry() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const data = await getAllGifts();
        setGifts(data);
        // Apply initial filters
        const filtered = data.filter(gift => {
          if (showOnlyAvailable && !gift.available) return false;
          if (searchTerm && !gift.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
          return true;
        });
        setFilteredGifts(filtered);
      } catch (error) {
        console.error("Error fetching gifts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  // Debounced filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = gifts.filter(gift => {
        if (showOnlyAvailable && !gift.available) return false;
        if (searchTerm && !gift.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
      setFilteredGifts(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, showOnlyAvailable, gifts]);

  // Memoize animation variants to prevent re-renders
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-16" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Heart className="mx-auto text-[#D4B56A] mb-3" size={32} />
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3 text-[#2D2D2D]">
            Gift Registry
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;re so grateful for your presence at our wedding. If
            you&apos;d like to help us celebrate with a gift, we&apos;ve created
            this registry with items we&apos;d love to receive.
          </p>
        </motion.div>

        <motion.div
          className="mb-8"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Search gifts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                />
              </div>

              <Button
                variant="outline"
                className="border-[#D4B56A]/30 text-[#D4B56A] hover:bg-[#D4B56A]/10 hover:text-[#D4B56A] w-full md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-[#D4B56A]/10 mt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="available-only"
                        checked={showOnlyAvailable}
                        onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                        className="rounded border-[#D4B56A]/30 text-[#D4B56A] focus:ring-[#D4B56A]/20"
                      />
                      <label
                        htmlFor="available-only"
                        className="text-sm font-medium text-[#2D2D2D] cursor-pointer"
                      >
                        Show only available gifts
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4B56A]"></div>
          </div>
        ) : filteredGifts.length === 0 ? (
          <div className="text-center py-16">
            <Gift className="mx-auto text-[#D4B56A]/50 mb-4" size={48} />
            <h3 className="font-serif text-xl font-medium text-[#2D2D2D] mb-2">
              No gifts found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {filteredGifts.map((gift) => (
              <motion.div key={gift.id} variants={itemVariants}>
                <Card className="h-full flex flex-col overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-0 pt-4 px-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg font-medium text-[#2D2D2D] line-clamp-1">
                        {gift.name}
                      </h3>
                      <Badge
                        variant={gift.available ? "outline" : "secondary"}
                        className={
                          gift.available
                            ? "bg-[#D4B56A]/10 text-[#D4B56A] hover:bg-[#D4B56A]/20 border-[#D4B56A]/30"
                            : "bg-gray-100 text-gray-500"
                        }
                      >
                        {gift.available ? "Available" : "Reserved"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow p-4">
                    <div className="relative w-full h-60 rounded-md overflow-hidden mb-3 bg-gray-100">
                      <Image
                        src={
                          gift.image_url ||
                          "/placeholder.svg?height=500&width=500"
                        }
                        alt={gift.name}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
