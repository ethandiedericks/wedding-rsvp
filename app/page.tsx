import HeroSection from "@/components/home/HeroSection";
import QuickLinksSection from "@/components/home/QuickLinksSection";
import WeddingDetailsSection from "@/components/home/WeddingDetailsSection";
import TimelineSection from "@/components/home/TimelineSection";
import BridalCrewSection from "@/components/home/BridalCrewSection";

export default function Home() {
  const weddingDetails = {
    date: "June 1, 2025",
    time: "6:00 PM",
    venue: "Rosewood Gardens",
    address: "123 Blossom Lane, Meadowville",
    dresscode: "Semi-formal",
  };

  const timeline = [
    {
      caption: "Our First Date",
      date: "June 10, 2019",
      description:
        "We met for coffee at a small café downtown. What was supposed to be a quick coffee turned into hours of conversation.",
      imageUrl:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop",
    },
    {
      caption: "The Proposal",
      date: "February 14, 2022",
      description:
        "Under the stars at our favorite spot by the lake, with a surprise photographer to capture the moment.",
      imageUrl:
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&auto=format&fit=crop",
    },
    {
      caption: "Engagement Party",
      date: "April 30, 2022",
      description:
        "Surrounded by friends and family, we celebrated our engagement with a beautiful garden party.",
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop",
    },
    {
      caption: "Wedding Venue Selected",
      date: "July 15, 2022",
      description:
        "After visiting multiple venues, we fell in love with the rustic charm of Willow Creek Estate.",
      imageUrl:
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop",
    },
    {
      caption: "Save the Date",
      date: "September 1, 2022",
      description:
        "We sent out our save-the-date cards, officially announcing our wedding date to everyone.",
      imageUrl:
        "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=600&auto=format&fit=crop",
    },
    {
      caption: "The Big Day",
      date: "September 15, 2023",
      description:
        "The day we've been waiting for, when we'll officially become a married couple!",
      imageUrl:
        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <WeddingDetailsSection weddingDetails={weddingDetails} />
      <TimelineSection timeline={timeline} />
      <BridalCrewSection />
      <QuickLinksSection />
    </div>
  );
}
