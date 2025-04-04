import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

type WeddingDetails = {
  date: string;
  time: string;
  venue: string;
  address: string;
  dresscode: string;
};

type WeddingDetailsSectionProps = {
  weddingDetails: WeddingDetails;
};

export default function WeddingDetailsSection({
  weddingDetails,
}: WeddingDetailsSectionProps) {
  return (
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
  );
}
