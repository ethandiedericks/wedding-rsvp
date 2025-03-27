"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CrewMember {
  id: number;
  name: string;
  role: string;
  headshot_url: string | null;
  quote: string | null;
}

export default function BridalCrew() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrew = async () => {
      const { data, error } = await supabase.from("bridal_crew").select("*");
      if (error) {
        console.error("Error fetching bridal crew:", error);
      } else {
        setCrew(data || []);
      }
      setLoading(false);
    };

    fetchCrew();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading bridal crew...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Meet the Bridal Crew
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {crew.map((member) => (
          <Card key={member.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <img
                src={member.headshot_url || "https://via.placeholder.com/150"}
                alt={member.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="mt-4 italic text-center">
                &quot;{member.quote || "No words yet!"}&quot;
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
