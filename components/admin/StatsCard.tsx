import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

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
    <Card className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="px-4 flex flex-row items-center justify-between space-y-0">
        <div className="tracking-tight text-sm font-medium">{title}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="px-4 ">
        <div className="text-2xl md:text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </Card>
  );
};

export default StatsCard;
