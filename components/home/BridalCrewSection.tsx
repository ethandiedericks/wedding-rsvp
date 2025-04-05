
'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CrewMember {
  id: number;
  name: string;
  role: string;
  headshot_url: string | null;
  quote: string | null;
}

export default function BridalCrewSection() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCrewMembers() {
      try {
        const { data, error: fetchError } = await supabase
          .from("bridal_crew")
          .select("*");

        if (fetchError) throw new Error(fetchError.message);
        setCrew(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bridal crew');
      } finally {
        setLoading(false);
      }
    }

    fetchCrewMembers();
  }, []);

  if (error) {
    return (
      <p className="text-center text-muted-foreground">
        Failed to load bridal crew.
      </p>
    );
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-sm text-primary font-medium uppercase tracking-wider mb-2">
            Wedding Party
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Meet the Bridal Crew
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your presence means the world to us. Get to know the incredible
            people who will be standing by our side on our special day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {loading ? (
            Array(3).fill(null).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16 mt-2" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="w-full h-48" />
                  <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
                </CardContent>
              </Card>
            ))
          ) : crew.length > 0 ? (
            crew.map((member) => (
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
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-3">
              No bridal crew members available yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
