"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";

type WeddingDetails = {
  date: string;
  time: string;
  venue: string;
  address: string;
  dresscode: string;
};

type WeddingDetailsSectionProps = {
  weddingDetails: WeddingDetails;
};

export default function WeddingDetailsSection({
  weddingDetails,
}: WeddingDetailsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const cardVariants = {
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
    <section id="details" className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm text-[#D4B56A] font-medium uppercase tracking-wider mb-2">
              Wedding Information
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-[#2D2D2D]">
              Join Us For Our Special Day
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;ve put together all the important details to help you plan
              for our wedding celebration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                <CardHeader className="text-center pb-2">
                  <Calendar className="mx-auto text-[#D4B56A]" size={28} />
                  <CardTitle className="text-lg mt-2">Date</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-medium">{weddingDetails.date}</p>
                  <p className="text-sm text-muted-foreground mt-1">Saturday</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                <CardHeader className="text-center pb-2">
                  <Clock className="mx-auto text-[#D4B56A]" size={28} />
                  <CardTitle className="text-lg mt-2">Time</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-medium">{weddingDetails.time}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Doors open at 5:30 PM
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                <CardHeader className="text-center pb-2">
                  <MapPin className="mx-auto text-[#D4B56A]" size={28} />
                  <CardTitle className="text-lg mt-2">Venue</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-medium">{weddingDetails.venue}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {weddingDetails.address}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="pt-4"
          >
            <Card className="border-none shadow-md bg-[#FDFBF7]">
              <CardContent className="p-6 text-center">
                <Sparkles className="mx-auto text-[#D4B56A] mb-3" size={24} />
                <p className="font-medium text-lg mb-2">
                  Dress Code: {weddingDetails.dresscode}
                </p>
                <p className="text-sm text-muted-foreground">
                  We kindly request that guests avoid wearing white
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
