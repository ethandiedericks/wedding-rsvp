import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Gift, Users } from "lucide-react";
import Link from "next/link";

export default function QuickLinksSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/rsvp" className="group">
            <Card className="border-none shadow-md hover:shadow-lg transition-all text-center h-full flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col flex-grow">
                <Calendar className="mx-auto text-primary mb-4" size={36} />
                <h3 className="text-lg font-medium mb-2 group-hover:text-primary">
                  RSVP
                </h3>
                <p className="text-sm text-muted-foreground flex-grow">
                  Confirm your attendance and meal preferences
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/gifts" className="group">
            <Card className="border-none shadow-md hover:shadow-lg transition-all text-center h-full flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col flex-grow">
                <Gift className="mx-auto text-primary mb-4" size={36} />
                <h3 className="text-lg font-medium mb-2 group-hover:text-primary">
                  Gift Registry
                </h3>
                <p className="text-sm text-muted-foreground flex-grow">
                  Browse and reserve wedding gifts
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/bridal-crew" className="group">
            <Card className="border-none shadow-md hover:shadow-lg transition-all text-center h-full flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col flex-grow">
                <Users className="mx-auto text-primary mb-4" size={36} />
                <h3 className="text-lg font-medium mb-2 group-hover:text-primary">
                  Bridal Crew
                </h3>
                <p className="text-sm text-muted-foreground flex-grow">
                  Meet our wedding party
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
