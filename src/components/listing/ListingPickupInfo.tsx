import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ListingPickupInfoProps {
  pickupLocation: string;
  pickupInstructions: string;
  onLocationChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
}

export const ListingPickupInfo = ({
  pickupLocation,
  pickupInstructions,
  onLocationChange,
  onInstructionsChange,
}: ListingPickupInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="pickup_location">Pickup Location *</Label>
        <Input
          id="pickup_location"
          placeholder="123 Main St, Vancouver, BC"
          value={pickupLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickup_instructions">Pickup Instructions</Label>
        <Textarea
          id="pickup_instructions"
          placeholder="Any special instructions for pickup..."
          value={pickupInstructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          rows={2}
        />
      </div>
    </>
  );
};
