
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CountdownTimer from "@/components/home/CountdownTimer";

type WeddingDetails = {
  date: string;
  time: string;
  venue: string;
  address: string;
  dresscode: string;
};

type HeroSectionProps = {
  weddingDetails: WeddingDetails;
};

export default function HeroSection({ weddingDetails }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFBF7]"
    >
      <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="container relative z-10 mx-auto px-4 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-1 inline-block"
          >
            <div className="text-sm font-medium tracking-[0.2em] uppercase mb-4 text-[#D4B56A]">
              WE'RE GETTING MARRIED
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal mb-8 text-[#2D2D2D]">
              Emma & James
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join us to celebrate the beginning of our new journey together
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <CountdownTimer targetDate="2025-06-01T18:00:00" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 space-x-4"
          >
            <Link href="/rsvp">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D4B56A] hover:bg-[#C6A55D] text-white px-8 py-3 inline-block transition-all duration-300 tracking-wider"
              >
                RSVP NOW
              </motion.span>
            </Link>
            <Link href="/details">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-[#D4B56A] hover:bg-[#D4B56A]/5 text-[#D4B56A] px-8 py-3 inline-block transition-all duration-300 tracking-wider"
              >
                Event Details
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Link 
          href="#timeline"
          className="text-[#2D2D2D]/80 flex flex-col items-center cursor-pointer"
          scroll={false}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </Link>
      </motion.div>
    </section>
  );
}
