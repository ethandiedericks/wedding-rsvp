"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TimelineEvent = {
  imageUrl: string;
  caption: string;
  date: string;
  description: string;
};

type TimelineSectionProps = {
  timeline: TimelineEvent[];
};

export default function TimelineSection({ timeline }: TimelineSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!timelineRef.current) return;

    const events = timelineRef.current.querySelectorAll(".timeline-event");
    events.forEach((event, index) => {
      gsap.fromTo(
        event,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: event,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
          delay: index * 0.2,
        }
      );
    });
  }, []);

  return (
    <section id="timeline" className="py-16 bg-[#FDFBF7]" ref={ref}>
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block text-sm text-[#D4B56A] font-medium uppercase tracking-wider mb-2"
          >
            Our Story
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-[#2D2D2D]"
          >
            Our Journey Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            A timeline of our love story, from the day we met to the moment we
            say &quot;I do.&quot;
          </motion.p>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Timeline line - visible on all devices, positioned on left for mobile */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#D4B56A]/20 transform md:-translate-x-1/2"></div>

          {timeline.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className="timeline-event relative mb-16 md:mb-24"
              >
                <div className="flex flex-col md:flex-row items-start">
                  {/* Timeline dot - always visible, on left for mobile */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#D4B56A] z-10 shadow-md absolute left-0 md:left-1/2 transform md:-translate-x-1/2 mt-4 md:mt-0"
                  >
                    <span className="text-white text-xs md:text-sm font-medium">
                      {index + 1}
                    </span>
                  </motion.div>

                  {/* For medium screens and up - alternating layout with proper spacing */}
                  <div
                    className={`w-full md:w-1/2 hidden md:block ${
                      isEven ? "md:order-2" : "md:order-1"
                    } p-4`}
                  >
                    {isEven ? (
                      <div className="md:ml-8 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-[#D4B56A] text-right">
                        <div className="inline-block rounded px-2 py-1 bg-[#D4B56A]/10 text-[#D4B56A] text-xs font-medium mb-2">
                          {event.date}
                        </div>
                        <h3 className="text-xl font-medium mb-2 text-[#2D2D2D]">
                          {event.caption}
                        </h3>
                        <p className="text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="md:mr-8 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                      >
                        <div className="relative h-48">
                          <Image
                            src={event.imageUrl}
                            alt={event.caption}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div
                    className={`w-full md:w-1/2 hidden md:block ${
                      isEven ? "md:order-1" : "md:order-2"
                    } p-4`}
                  >
                    {isEven ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="md:mr-8 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                      >
                        <div className="relative h-48">
                          <Image
                            src={event.imageUrl}
                            alt={event.caption}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <div className="md:ml-8 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-[#D4B56A] text-left">
                        <div className="inline-block rounded px-2 py-1 bg-[#D4B56A]/10 text-[#D4B56A] text-xs font-medium mb-2">
                          {event.date}
                        </div>
                        <h3 className="text-xl font-medium mb-2 text-[#2D2D2D]">
                          {event.caption}
                        </h3>
                        <p className="text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mobile layout - timeline on left, all content on right */}
                  <div className="md:hidden pl-12 w-full">
                    <div className="mb-4">
                      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-[#D4B56A]">
                        <div className="inline-block rounded px-2 py-1 bg-[#D4B56A]/10 text-[#D4B56A] text-xs font-medium mb-2">
                          {event.date}
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-[#2D2D2D]">
                          {event.caption}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                    >
                      <div className="relative h-40">
                        <Image
                          src={event.imageUrl}
                          alt={event.caption}
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
