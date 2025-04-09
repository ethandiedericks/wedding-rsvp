"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RSVP } from "@/types/admin";
import { DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import DeleteConfirmation from "./DeleteConfirmation";

interface RSVPTableProps {
  rsvps: RSVP[];
  profiles: Record<string, string>;
  onEdit: (rsvp: RSVP) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const RSVPTable: React.FC<RSVPTableProps> = ({
  rsvps,
  profiles,
  onEdit,
  onDelete,
  loading = false,
}) => {


  return (
    <Table>
      <TableHeader className="bg-[#FDFBF7]">
        <TableRow className="border-b border-[#D4B56A]/10 hover:bg-[#FDFBF7]">
          <TableHead className="text-[#2D2D2D] font-medium">
            Full Name
          </TableHead>
          <TableHead className="text-[#2D2D2D] font-medium">
            Attending
          </TableHead>
          <TableHead className="text-[#2D2D2D] font-medium">Guests</TableHead>
          <TableHead className="text-[#2D2D2D] font-medium">
            Additional Guests
          </TableHead>
          <TableHead className="text-[#2D2D2D] font-medium">
            Dietary Restrictions
          </TableHead>
          <TableHead className="text-[#2D2D2D] font-medium">
            Halaal
          </TableHead>
          <TableHead className="text-[#2D2D2D] font-medium">
            Song Request
          </TableHead>
          <TableHead className="text-[#2D2D2D] font-medium">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center py-8 text-muted-foreground"
            >
              Loading RSVPs...
            </TableCell>
          </TableRow>
        ) : rsvps.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center py-8 text-muted-foreground"
            >
              No RSVPs found
            </TableCell>
          </TableRow>
        ) : (
          rsvps.map((rsvp) => (
            <TableRow
              key={rsvp.id}
              className="border-b border-[#D4B56A]/10 hover:bg-[#FDFBF7]/50"
            >
              <TableCell className="font-medium">
                {profiles[rsvp.id] || "Unknown"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    rsvp.attending
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {rsvp.attending ? "Yes" : "No"}
                </span>
              </TableCell>
              <TableCell>{rsvp.guest_count}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {Array.isArray(rsvp.additional_guests) &&
                rsvp.additional_guests.length > 0
                  ? rsvp.additional_guests
                      .map(
                        (guest) =>
                          `${guest.full_name || guest.full_name} ${
                            guest.surname
                          }`
                      )
                      .join(", ")
                  : "—"}
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                {rsvp.dietary_restrictions || "—"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${rsvp.halaal_preference ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {rsvp.halaal_preference ? "Yes" : "No"}
                </span>
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                {rsvp.song_request || "—"}
              </TableCell>
              <TableCell className="space-x-2">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(rsvp)}
                    className="border-[#D4B56A]/30 text-[#D4B56A] hover:bg-[#D4B56A]/10 hover:text-[#D4B56A]"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DeleteConfirmation
                  itemType="RSVP"
                  itemName={profiles[rsvp.id] || "Unknown"}
                  onDelete={() => onDelete(rsvp.id)}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RSVPTable;
