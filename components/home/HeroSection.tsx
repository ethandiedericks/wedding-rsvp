"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import CountdownTimer from "@/components/home/CountdownTimer";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoaded(true);

    // Handle video looping - this ensures seamless playback
    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", () => {
        // Reset to the beginning and start playing again
        video.currentTime = 0;
        video.play();
      });

      return () => {
        // Clean up the event listener
        if (video) {
          video.removeEventListener("ended", () => {});
        }
      };
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay with texture for better visual hierarchy */}
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

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
              {"WE'RE GETTING MARRIED"}
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal mb-4 text-white">
              {"Russel & Larshanay"}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto leading-relaxed"
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
                className="border border-[#D4B56A] bg-[#D4B56A]/10 hover:bg-[#D4B56A]/20 text-[#D4B56A] px-8 py-3 inline-block transition-all duration-300 tracking-wider"
              >
                RSVP NOW
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-2.5 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Link
          href="#details"
          className="text-white/80 flex flex-col items-center cursor-pointer"
          scroll={false}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("details")
              ?.scrollIntoView({ behavior: "smooth" });
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
