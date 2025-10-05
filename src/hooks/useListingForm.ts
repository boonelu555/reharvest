import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { foodClassifier } from "@/services/foodClassifier";

export interface ListingFormData {
  title: string;
  description: string;
  quantity: string;
  category: string;
  pickup_location: string;
  pickup_instructions: string;
  available_until: string;
}

export const useListingForm = (onSuccess: () => void, onOpenChange: (open: boolean) => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
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
  const [isClassifying, setIsClassifying] = useState(false);

  const resetForm = () => {
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

  const classifyImage = async () => {
    if (!imageFile) {
      toast({
        title: "No image",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    console.log('🚀 Starting AI classification process...');
    setIsClassifying(true);

    try {
      console.log('Step 1: Loading model...');
      // Load the model if not already loaded
      await foodClassifier.loadModel();
      console.log('Step 1: ✅ Model loaded');

      console.log('Step 2: Creating image element...');
      // Create image element for classification
      const imgElement = await foodClassifier.createImageElement(imageFile);
      console.log('Step 2: ✅ Image element created');

      console.log('Step 3: Classifying image...');
      // Classify the image
      const result = await foodClassifier.classifyImage(imgElement);
      console.log('Step 3: ✅ Classification complete');

      // Update form data with AI predictions
      setFormData({
        ...formData,
        title: result.title,
        description: result.description,
        category: result.category,
      });

      toast({
        title: "AI Classification Complete!",
        description: `Detected: ${result.title} with ${Math.round(result.confidence * 100)}% confidence`,
      });
      
      console.log('🎉 Classification successful!');
    } catch (error) {
      console.error('❌ Classification error:', error);
      
      let errorMessage = "Could not analyze the image. Please fill in details manually.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      
      toast({
        title: "Classification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsClassifying(false);
      console.log('Classification process ended');
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
      resetForm();
    }
    setLoading(false);
  };

  return {
    loading,
    formData,
    setFormData,
    imageFile,
    imagePreview,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    handleImageChange,
    handleSubmit,
    classifyImage,
    isClassifying,
  };
};
