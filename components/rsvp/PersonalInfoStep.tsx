import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { FormData } from "@/lib/types";

type PersonalInfoStepProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  nextStep: () => void;
};

export default function PersonalInfoStep({
  formData,
  setFormData,
  nextStep,
}: PersonalInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <CardContent>
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-center mb-6">
          Your Information
        </h3>
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <Input
          name="email"
          value={formData.email}
          disabled
          placeholder="Email"
        />
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number (optional)"
        />
        <div className="flex justify-end mt-6">
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
