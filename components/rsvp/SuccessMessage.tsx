"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessMessage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="mx-auto text-[#D4B56A] mb-3" size={32} />
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3 text-[#2D2D2D]">
            Thank You!
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your RSVP has been submitted successfully. We&apos;re looking
            forward to celebrating with you!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#D4B56A]/10 flex items-center justify-center mb-6">
                  <Heart className="h-10 w-10 text-[#D4B56A]" />
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#2D2D2D] mb-6 text-center">
                  We&apos;ve received your RSVP
                </h3>

                <div className="w-full space-y-4 mb-8">
                  <div className="flex items-center p-4 bg-[#FDFBF7] rounded-lg border border-[#D4B56A]/20">
                    <Calendar className="h-5 w-5 text-[#D4B56A] mr-3" />
                    <div>
                      <h4 className="font-medium text-[#2D2D2D]">
                        Save the Date
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        June 15, 2024 at 3:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-[#FDFBF7] rounded-lg border border-[#D4B56A]/20">
                    <MapPin className="h-5 w-5 text-[#D4B56A] mr-3" />
                    <div>
                      <h4 className="font-medium text-[#2D2D2D]">
                        Venue Location
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        The Grand Ballroom, 123 Wedding Lane
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    asChild
                    className="flex-1 bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
                  >
                    <Link href="/gifts">View Gift Registry</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-[#D4B56A]/30 text-[#D4B56A] hover:bg-[#D4B56A]/10 hover:text-[#D4B56A]"
                  >
                    <Link href="/">Return Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
