"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { getBridalCrew } from "@/app/actions/actions";

interface CrewMember {
  id: number;
  name: string;
  role: string;
  headshot_url: string | null;
  quote: string | null;
}
const ImageWithFallback = ({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 text-center text-sm text-gray-500 px-2">
        Image not available
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 hover:scale-105"
      onError={() => setError(true)}
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  );
};

export default function BridalCrewSection() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    async function fetchCrewMembers() {
      try {
        const data = await getBridalCrew();
        setCrew(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bridal crew"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCrewMembers();
  }, []);

  if (error) {
    return (
      <p className="text-center text-black">Failed to load bridal crew.</p>
    );
  }

  return (
    <section id="bridal-crew" className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block text-sm text-[#D4B56A] font-medium uppercase tracking-wider mb-2"
          >
            Wedding Party
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-[#2D2D2D]"
          >
            Meet the Bridal Crew
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Your presence means the world to us. Get to know the incredible
            people who will be standing by our side on our special day.
          </motion.p>
        </div>

        {!loading && crew.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-8">
            No bridal crew members to display. You need to log in to view this
            content.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {crew.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <Card className="flex flex-col h-full border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                      <ImageWithFallback
                        src={member.headshot_url}
                        alt={member.name}
                      />
                    </div>
                    <p className="mt-4 italic text-center text-muted-foreground">
                      &quot;{member.quote}&quot;
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
