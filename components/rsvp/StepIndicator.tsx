import { cn } from "@/lib/utils";
import { CardHeader, CardTitle } from "@/components/ui/card";

type StepIndicatorProps = {
  step: number;
};

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <CardHeader>
      <CardTitle className="text-center">RSVP</CardTitle>
      <div className="flex justify-center space-x-2 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              step === i ? "bg-primary" : "bg-primary/30"
            )}
          />
        ))}
      </div>
    </CardHeader>
  );
}
