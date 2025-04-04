import { Heart } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <Heart 
        className="h-12 w-12 text-rose-500 animate-[heartbeat_1.2s_ease-in-out_infinite]"
        aria-label="Loading"
      />
    </div>
  );
}