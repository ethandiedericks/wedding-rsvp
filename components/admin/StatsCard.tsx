import type React from "react";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  label: string;
  icon: LucideIcon;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  label,
  icon: Icon,
}) => {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[#2D2D2D]">{title}</h3>
          <Icon className="h-5 w-5 text-[#D4B56A]" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-[#2D2D2D]">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
