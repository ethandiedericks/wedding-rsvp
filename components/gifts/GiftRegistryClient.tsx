"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Heart, Gift, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GiftItem {
  id: number;
  name: string;
  available: boolean;
  claimed_by: string | null;
  image_url: string | null;
}

interface GiftRegistryClientProps {
  initialGifts: GiftItem[];
}

export function GiftRegistryClient({ initialGifts }: GiftRegistryClientProps) {
  const [gifts] = useState<GiftItem[]>(initialGifts);
  const [filteredGifts, setFilteredGifts] = useState<GiftItem[]>(initialGifts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Filter gifts based on search term and availability
  const filterGifts = () => {
    const filtered = gifts.filter(gift => {
      if (showOnlyAvailable && !gift.available) return false;
      if (searchTerm && !gift.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
    setFilteredGifts(filtered);
  };

  // Update filters when search term or availability filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterGifts();
  };

  const handleAvailableFilterChange = () => {
    setShowOnlyAvailable(!showOnlyAvailable);
    filterGifts();
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="container mx-auto px-4 py-8" ref={ref}>
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">Gift Registry</h1>
        <p className="text-muted-foreground">
          Browse through our gift registry and help us celebrate our special day.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search gifts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
            />
          </div>
          <Button
            variant="outline"
            className="border-[#D4B56A]/30 hover:bg-[#D4B56A]/5"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyAvailable}
                    onChange={handleAvailableFilterChange}
                    className="rounded border-[#D4B56A]/30 text-[#D4B56A] focus:ring-[#D4B56A]/20"
                  />
                  <span>Show only available gifts</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift, index) => (
          <motion.div
            key={gift.id}
            custom={index}
            variants={fadeInUpVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Card className="overflow-hidden border-none shadow-md h-full">
              {gift.image_url ? (
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={gift.image_url}
                    alt={gift.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <Gift size={48} className="text-gray-400" />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-serif text-lg text-[#2D2D2D] mb-2">{gift.name}</h3>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={gift.available ? "default" : "secondary"}
                    className={gift.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {gift.available ? "Available" : "Claimed"}
                  </Badge>
                  {!gift.available && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Heart size={14} className="mr-1" />
                      <span>Claimed by {gift.claimed_by}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
