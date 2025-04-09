"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteConfirmationProps {
  itemType: "RSVP" | "Gift" | "Crew Member";
  itemName: string;
  onDelete: () => void;
  disabled?: boolean;
}

export default function DeleteConfirmation({
  itemType,
  itemName,
  onDelete,
  disabled = false,
}: DeleteConfirmationProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled}
          className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-[#D4B56A]/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-xl text-[#2D2D2D]">
            Delete {itemType}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {itemType.toLowerCase()} <span className="font-medium">{itemName}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#D4B56A]/30 text-[#2D2D2D] hover:bg-[#D4B56A]/10 hover:text-[#2D2D2D]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
