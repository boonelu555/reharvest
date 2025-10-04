import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateListingDialog = ({ open, onOpenChange, onSuccess }: CreateListingDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    category: "",
    pickup_location: "",
    pickup_instructions: "",
    available_until: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Generate time options (every 30 minutes)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const period = hours < 12 ? "AM" : "PM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return {
      value: `${String(hours).padStart(2, "0")}:${minutes}`,
      label: `${displayHours}:${minutes} ${period}`,
    };
  });

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Combine date and time
    const [hours, minutes] = selectedTime.split(":");
    const availableUntil = new Date(selectedDate);
    availableUntil.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    let imageUrl = "";

    // Upload image if selected
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("food-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("food-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    const { error } = await supabase.from("food_listings").insert({
      ...formData,
      available_until: availableUntil.toISOString(),
      provider_id: session.user.id,
      status: "available",
      image_url: imageUrl || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your listing has been created",
      });
      onSuccess();
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        quantity: "",
        category: "",
        pickup_location: "",
        pickup_instructions: "",
        available_until: "",
      });
      setImageFile(null);
      setImagePreview("");
      setSelectedDate(undefined);
      setSelectedTime("");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Food Listing</DialogTitle>
          <DialogDescription>
            Share surplus food with your community
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Fresh Bread and Pastries"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the food items available..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Food Photo (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                placeholder="e.g., 10 items, 5kg"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
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

          <div className="space-y-2">
            <Label htmlFor="pickup_location">Pickup Location *</Label>
            <Input
              id="pickup_location"
              placeholder="123 Main St, Vancouver, BC"
              value={formData.pickup_location}
              onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup_instructions">Pickup Instructions</Label>
            <Textarea
              id="pickup_instructions"
              placeholder="Any special instructions for pickup..."
              value={formData.pickup_instructions}
              onChange={(e) => setFormData({ ...formData, pickup_instructions: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Available Until *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < getMinDate()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Food will be available until this date and time
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;