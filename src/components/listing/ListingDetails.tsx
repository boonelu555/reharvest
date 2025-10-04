import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ListingDetailsProps {
  quantity: string;
  category: string;
  onQuantityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const ListingDetails = ({
  quantity,
  category,
  onQuantityChange,
  onCategoryChange,
}: ListingDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          placeholder="e.g., 10 items, 5kg"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bakery">Bakery</SelectItem>
            <SelectItem value="produce">Produce</SelectItem>
            <SelectItem value="prepared">Prepared Food</SelectItem>
            <SelectItem value="dairy">Dairy</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
