import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RSVP } from "@/types/admin";
import { DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";

interface RSVPTableProps {
  rsvps: RSVP[];
  profiles: Record<string, string>;
  onEdit: (rsvp: RSVP) => void;
  onDelete: (id: string) => void;
}

const RSVPTable: React.FC<RSVPTableProps> = ({
  rsvps,
  profiles,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Attending</TableHead>
          <TableHead>Guests</TableHead>
          <TableHead>Party Choice</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Dietary Restrictions</TableHead>
          <TableHead>Song Request</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rsvps.map((rsvp) => (
          <TableRow key={rsvp.id}>
            <TableCell>{profiles[rsvp.id] || rsvp.id}</TableCell>
            <TableCell>{rsvp.attending ? "Yes" : "No"}</TableCell>
            <TableCell>{rsvp.guest_count}</TableCell>
            <TableCell>{rsvp.party_choice}</TableCell>
            <TableCell>{rsvp.gender}</TableCell>
            <TableCell>{rsvp.dietary_restrictions || "None"}</TableCell>
            <TableCell>{rsvp.song_request || "None"}</TableCell>
            <TableCell className="space-x-2">
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(rsvp)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(rsvp.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RSVPTable;
