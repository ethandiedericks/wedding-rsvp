import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormData } from "@/lib/types";
import { toast } from "sonner";

type PartySelectionStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  prevStep: () => void;
  nextStep: () => void;
};

export default function PartySelectionStep({
  formData,
  setFormData,
  prevStep,
  nextStep,
}: PartySelectionStepProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        {formData.attending && (
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-medium mb-6 text-center">
              Bachelor & Bachelorette Parties
            </h3>
            <p className="text-center text-muted-foreground mb-8">
              Would you like to join the pre-wedding celebrations? Select which
              party you'd like to attend.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    gender: "male",
                    partyChoice: "none",
                  })
                }
                className={cn(
                  "flex-1 py-4 px-6 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center",
                  formData.gender === "male"
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-transparent border-border hover:border-primary/30"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">Bachelor Party</span>
                <span className="text-sm text-muted-foreground mt-1">
                  For the guys
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    gender: "female",
                    partyChoice: "none",
                  })
                }
                className={cn(
                  "flex-1 py-4 px-6 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center",
                  formData.gender === "female"
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-transparent border-border hover:border-primary/30"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">Bachelorette Party</span>
                <span className="text-sm text-muted-foreground mt-1">
                  For the ladies
                </span>
              </button>
            </div>
            {formData.gender && (
              <div className="animate-fade-in">
                <h4 className="text-center font-medium mb-4">
                  {formData.gender === "male"
                    ? "Will you attend the Bachelor Party?"
                    : "Will you attend the Bachelorette Party?"}
                </h4>
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        partyChoice:
                          formData.gender === "male"
                            ? "bachelor"
                            : "bachelorette",
                      })
                    }
                    className={cn(
                      "px-6 py-2 rounded-full border transition-all duration-300",
                      formData.partyChoice !== "none"
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent border-border hover:border-primary/50"
                    )}
                  >
                    "Yes, count me in!"
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, partyChoice: "none" })
                    }
                    className={cn(
                      "px-6 py-2 rounded-full border transition-all duration-300",
                      formData.partyChoice === "none"
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent border-border hover:border-primary/50"
                    )}
                  >
                    "No, I'll skip this one"
                  </button>
                </div>
              </div>
            )}
            {formData.partyChoice !== "none" && (
              <div className="bg-secondary/70 rounded-lg p-6 animate-scale-in">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      stroke="white"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Join our WhatsApp Group</h4>
                    <p className="text-sm text-muted-foreground">
                      For all party updates and coordination
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white rounded-md">
                  <span className="flex-1 truncate text-sm">
                    {formData.partyChoice === "bachelor"
                      ? "https://chat.whatsapp.com/bachelor-group-link"
                      : "https://chat.whatsapp.com/bachelorette-group-link"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const link =
                        formData.partyChoice === "bachelor"
                          ? "https://chat.whatsapp.com/bachelor-group-link"
                          : "https://chat.whatsapp.com/bachelorette-group-link";
                      navigator.clipboard
                        .writeText(link)
                        .then(() =>
                          toast.success("WhatsApp link copied to clipboard!")
                        )
                        .catch(() => toast.error("Failed to copy link"));
                    }}
                    className="ml-2 text-primary hover:text-primary/80 hover:cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
