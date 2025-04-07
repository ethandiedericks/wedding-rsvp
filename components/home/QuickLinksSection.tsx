"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Gift, Users, Camera, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export default function QuickLinksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const links = [
    {
      title: "RSVP",
      description: "Confirm your attendance and meal preferences",
      icon: Calendar,
      href: "/rsvp",
    },
    {
      title: "Gift Registry",
      description: "Browse and reserve wedding gifts",
      icon: Gift,
      href: "/gifts",
    },
    {
      title: "Bridal Crew",
      description: "Meet our wedding party",
      icon: Users,
      href: "#bridal-crew",
    },
    {
      title: "Photo Gallery",
      description: "View our favorite moments together",
      icon: Camera,
      href: "#gallery",
    },
    {
      title: "Venue & Directions",
      description: "Find your way to our celebration",
      icon: MapPin,
      href: "#details",
    },
    {
      title: "Our Story",
      description: "The journey that brought us here",
      icon: Heart,
      href: "#timeline",
    },
  ];

  return (
    <section className="py-24 bg-[#FDFBF7]" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block text-sm text-[#D4B56A] font-medium uppercase tracking-wider mb-2"
          >
            Quick Access
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-[#2D2D2D]"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Quick links to help you navigate our wedding website
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {links.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Link href={link.href} className="group block h-full">
                <Card className="border-none shadow-md hover:shadow-lg transition-all text-center h-full flex flex-col justify-between hover:border-l-4 hover:border-l-[#D4B56A]">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <link.icon
                      className="mx-auto text-[#D4B56A] mb-4 group-hover:scale-110 transition-transform duration-300"
                      size={36}
                    />
                    <h3 className="text-lg font-medium mb-2 group-hover:text-[#D4B56A] transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-grow">
                      {link.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
