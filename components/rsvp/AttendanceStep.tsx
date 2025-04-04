import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { FormData, Gift } from "@/lib/types";

type AttendanceStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  gifts: Gift[];
  prevStep: () => void;
  nextStep: () => void;
};

export default function AttendanceStep({
  formData,
  setFormData,
  gifts,
  prevStep,
  nextStep,
}: AttendanceStepProps) {
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const renderAttendingButtons = () => (
    <div className="flex justify-center space-x-4 mb-6">
      {[true, false].map((value) => (
        <Button
          key={value ? "yes" : "no"}
          type="button"
          onClick={() => setFormData({ ...formData, attending: value })}
          variant={formData.attending === value ? "default" : "outline"}
        >
          {value ? "Yes, I'll be there" : "Sorry, can't make it"}
        </Button>
      ))}
    </div>
  );

  return (
    <CardContent>
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-center mb-6">
          Will you be attending?
        </h3>
        {renderAttendingButtons()}
        {formData.attending === true && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests (including yourself)
              </label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("guestCount", value)
                }
                value={formData.guestCount.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Number of Guests (including yourself)" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(6)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} {i === 1 ? "person" : "people"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gift Selection (optional)
              </label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("selectedGift", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Gift (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {gifts.map((gift) => (
                    <SelectItem key={gift.id} value={gift.id.toString()}>
                      {gift.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button
            type="button"
            onClick={nextStep}
            disabled={formData.attending === null}
          >
            Next
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
