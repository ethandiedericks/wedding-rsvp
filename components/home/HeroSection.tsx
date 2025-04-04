"use client";

import { useEffect, useState } from "react";
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2400&auto=format&fit=crop")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 backdrop-blur-xs"></div>

      <div
        className={cn(
          "container relative z-10 mx-auto px-4 text-center text-white transition-all duration-1000 transform",
          loaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        )}
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-1 inline-block">
            <div className="text-sm font-medium tracking-wider uppercase mb-2 animate-fade-in opacity-90">
              We're getting married
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 animate-slide-in">
              Emma & James
            </h1>
          </div>

          <p
            className="text-lg md:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            Join us to celebrate the beginning of our new journey together
          </p>

          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CountdownTimer targetDate="2025-06-01T18:00:00" />
          </div>

          <div
            className="mt-12 animate-slide-in"
            style={{ animationDelay: "600ms" }}
          >
            <Link href="/rsvp">
              <span className="bg-white/20 hover:bg-white/30 backdrop-filter backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full inline-block transition-all duration-300 mx-2 my-2">
                RSVP Now
              </span>
            </Link>
            <Link href="/details">
              <span className="bg-white text-black/90 hover:text-black px-8 py-3 rounded-full inline-block transition-all duration-300 mx-2 my-2">
                Event Details
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <Link href="/rsvp" className="text-white/80 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
