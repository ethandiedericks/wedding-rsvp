"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Gift {
  id: number;
  name: string;
  available: boolean;
  claimed_by: string | null;
  image_url: string | null;
  estimated_price: number | null;
}

export default function GiftRegistry() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGifts = async () => {
      const { data, error } = await supabase.from("gifts").select("*");
      if (error) {
        console.error("Error fetching gifts:", error);
      } else {
        setGifts(data || []);
      }
      setLoading(false);
    };

    fetchGifts();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading gifts...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Gift Registry</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gifts.map((gift) => (
          <Card key={gift.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{gift.name}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {gift.estimated_price
                    ? `R${gift.estimated_price.toFixed(2)}`
                    : "N/A"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <img
                src={gift.image_url || "https://via.placeholder.com/150"}
                alt={gift.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant={gift.available ? "default" : "secondary"}>
                {gift.available ? "Available" : "Reserved"}
              </Badge>
              {!gift.available && gift.claimed_by && (
                <span className="text-sm text-gray-600">Reserved</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
