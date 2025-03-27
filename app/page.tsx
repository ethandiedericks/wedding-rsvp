"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  const weddingDate = new Date("2025-06-01T18:00:00"); // Set your wedding date here
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  // Sample timeline data (replace with real image URLs and captions)
  const timeline = [
    {
      imageUrl: "/placeholder.svg?height=300&width=400",
      caption: "First Date",
      date: "June 2019",
      description: "Where it all began at Café Lumière",
    },
    {
      imageUrl: "/placeholder.svg?height=300&width=400",
      caption: "First Trip Together",
      date: "March 2020",
      description: "Our adventure to the mountains",
    },
    {
      imageUrl: "/placeholder.svg?height=300&width=400",
      caption: "Proposal",
      date: "December 2023",
      description: "The perfect sunset and the perfect question",
    },
  ];

  // Wedding details
  const weddingDetails = {
    date: "June 1, 2025",
    time: "6:00 PM",
    venue: "Rosewood Gardens",
    address: "123 Blossom Lane, Meadowville",
    dresscode: "Semi-formal",
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Wedding hero image"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white space-y-6 px-4">
          <h1 className="font-serif text-5xl md:text-7xl">Emma & James</h1>
          <p className="text-xl md:text-2xl font-light">Are getting married</p>
          <p className="text-lg md:text-xl">
            {weddingDetails.date} • {weddingDetails.venue}
          </p>
          <Link href={"/rsvp"} passHref>
            <Button
              variant="outline"
              className="mt-8 bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black transition-all"
            >
              RSVP Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Wedding Countdown Timer */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2">
              <Heart className="text-primary" size={20} />
              <h2 className="text-2xl font-serif">Countdown to Forever</h2>
              <Heart className="text-primary" size={20} />
            </div>

            {timeLeft ? (
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                <Card className="border-none shadow-lg bg-white">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {timeLeft.days}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">Days</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-white">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {timeLeft.hours}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">Hours</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-white">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {timeLeft.minutes}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">
                      Minutes
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-white">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {timeLeft.seconds}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">
                      Seconds
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-center">Loading countdown...</p>
            )}
          </div>
        </div>
      </section>

      {/* Wedding Details */}
      <section id="details" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-serif">Wedding Details</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <Calendar className="mx-auto text-primary" size={28} />
                  <CardTitle className="text-lg mt-2">Date</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>{weddingDetails.date}</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <Clock className="mx-auto text-primary" size={28} />
                  <CardTitle className="text-lg mt-2">Time</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>{weddingDetails.time}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Doors open at 5:30 PM
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <MapPin className="mx-auto text-primary" size={28} />
                  <CardTitle className="text-lg mt-2">Venue</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>{weddingDetails.venue}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {weddingDetails.address}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="pt-4">
              <Card className="border-none shadow-md">
                <CardContent className="p-6 text-center">
                  <p className="font-medium">
                    Dress Code: {weddingDetails.dresscode}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We kindly request that guests avoid wearing white
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12">Our Journey</h2>

          <div className="max-w-4xl mx-auto">
            {timeline.map((event, index) => (
              <div key={index} className="mb-16 last:mb-0">
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8 items-center`}
                >
                  <div className="w-full md:w-1/2 relative">
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.caption}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 space-y-3">
                    <p className="text-sm font-medium text-primary">
                      {event.date}
                    </p>
                    <h3 className="text-xl font-medium">{event.caption}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </div>

                {index < timeline.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="w-0.5 h-8 bg-primary/30"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
