import { Separator } from "@radix-ui/react-select";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 bg-[#D4B56A]/10 border-t">
      <div className="container mx-auto px-4 text-center">
        <p className="font-serif text-xl mb-2">Russel & Larshanay</p>
        <p className="text-sm text-muted-foreground">
          June 1, 2025 • Rosewood Gardens
        </p>
        <Separator className="my-4 max-w-xs mx-auto" />
        <p className="text-sm">
          For questions, please contact us at{" "}
          <a
            href="mailto:wedding@example.com"
            className="text-primary hover:underline"
          >
            wedding@example.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
