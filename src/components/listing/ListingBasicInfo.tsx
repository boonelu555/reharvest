import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface ListingBasicInfoProps {
  title: string;
  description: string;
  imagePreview: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClassifyImage?: () => void;
  isClassifying?: boolean;
}

export const ListingBasicInfo = ({
  title,
  description,
  imagePreview,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  onClassifyImage,
  isClassifying = false,
}: ListingBasicInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="image">Food Photo (Optional)</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-2 space-y-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {onClassifyImage && (
              <Button
                type="button"
                onClick={onClassifyImage}
                disabled={isClassifying}
                className="w-full"
                variant="secondary"
              >
                {isClassifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Auto-Fill with AI
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Fresh Bread and Pastries"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the food items available..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </div>
    </>
  );
};
