import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useListingForm } from "@/hooks/useListingForm";
import { ListingBasicInfo } from "@/components/listing/ListingBasicInfo";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { ListingPickupInfo } from "@/components/listing/ListingPickupInfo";
import { ListingDateTime } from "@/components/listing/ListingDateTime";

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateListingDialog = ({ open, onOpenChange, onSuccess }: CreateListingDialogProps) => {
  const {
    loading,
    formData,
    setFormData,
    imagePreview,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    handleImageChange,
    handleSubmit,
    classifyImage,
    isClassifying,
  } = useListingForm(onSuccess, onOpenChange);

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
          <ListingBasicInfo
            title={formData.title}
            description={formData.description}
            imagePreview={imagePreview}
            onTitleChange={(value) => setFormData({ ...formData, title: value })}
            onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
            onImageChange={handleImageChange}
            onClassifyImage={classifyImage}
            isClassifying={isClassifying}
          />

          <ListingDetails
            quantity={formData.quantity}
            category={formData.category}
            onQuantityChange={(value) => setFormData({ ...formData, quantity: value })}
            onCategoryChange={(value) => setFormData({ ...formData, category: value })}
          />

          <ListingPickupInfo
            pickupLocation={formData.pickup_location}
            pickupInstructions={formData.pickup_instructions}
            onLocationChange={(value) => setFormData({ ...formData, pickup_location: value })}
            onInstructionsChange={(value) => setFormData({ ...formData, pickup_instructions: value })}
          />

          <ListingDateTime
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />

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