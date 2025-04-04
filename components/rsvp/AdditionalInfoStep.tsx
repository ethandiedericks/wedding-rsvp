import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { FormData } from "@/lib/types";

type AdditionalInfoStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  prevStep: () => void;
  isSubmitting: boolean;
};

export default function AdditionalInfoStep({
  formData,
  setFormData,
  prevStep,
  isSubmitting,
}: AdditionalInfoStepProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <CardContent>
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-center mb-6">
          Additional Information
        </h3>
        <Input
          name="dietaryRestrictions"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          placeholder="Dietary Restrictions (optional)"
        />
        <Textarea
          name="songRequest"
          value={formData.songRequest}
          onChange={handleChange}
          placeholder="Song Request (optional)"
          rows={4}
        />
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit RSVP"}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
