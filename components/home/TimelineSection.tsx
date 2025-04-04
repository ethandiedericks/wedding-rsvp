"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  return (
    <section id="timeline" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-sm text-primary font-medium uppercase tracking-wider mb-2">
            Our Story
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Our Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A timeline of our love story, from the day we met to the moment we
            say "I do."
          </p>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform -translate-x-1/2"></div>

          {timeline.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`relative mb-16 md:mb-24 transition-opacity duration-1000 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div
                  className={`flex flex-col md:flex-row items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full md:w-1/2 p-4">
                    <div
                      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 ${
                        index === activeIndex
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className="relative h-48">
                        <Image
                          src={
                            event.imageUrl ||
                            "/placeholder.svg?height=192&width=300"
                          }
                          alt={event.caption}
                          fill
                          className="object-cover transition-transform hover:scale-105 duration-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary z-10 shadow-md transition-transform duration-300 ${
                      index === activeIndex ? "scale-110" : ""
                    }`}
                  >
                    <span className="text-white text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>

                  <div
                    className={`w-full md:w-1/2 p-4 ${
                      isEven ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div
                      className={`p-6 bg-white rounded-xl shadow-sm transition-all duration-300 ${
                        index === activeIndex
                          ? "border-l-4 border-primary -translate-y-1"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="inline-block rounded px-2 py-1 bg-primary/10 text-primary text-xs font-medium mb-2">
                        {event.date}
                      </div>
                      <h3 className="text-xl font-medium mb-2">
                        {event.caption}
                      </h3>
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
