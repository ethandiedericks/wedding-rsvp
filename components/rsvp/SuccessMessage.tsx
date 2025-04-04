import { Card, CardContent } from "@/components/ui/card";

export default function SuccessMessage() {
  return (
    <div className="container mx-auto p-4 text-center">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-medium mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-6">
            Your RSVP has been submitted successfully. We’ll see you soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
