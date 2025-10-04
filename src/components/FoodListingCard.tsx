import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Package, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface FoodListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    quantity: string;
    category: string;
    pickup_location: string;
    available_until: string;
    status: string;
    image_url?: string;
  };
  onUpdate: () => void;
  isProvider: boolean;
}

const FoodListingCard = ({ listing, onUpdate, isProvider }: FoodListingCardProps) => {
  const { toast } = useToast();

  const handleClaim = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("claims").insert({
      listing_id: listing.id,
      consumer_id: session.user.id,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message.includes("duplicate")
          ? "You've already claimed this item"
          : "Failed to claim listing",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Food claimed! Check your email for pickup details.",
      });
      onUpdate();
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("food_listings")
      .delete()
      .eq("id", listing.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Listing has been removed",
      });
      onUpdate();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-secondary text-secondary-foreground";
      case "claimed":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {listing.image_url ? (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
          {listing.category && (
            <Badge variant="outline">{listing.category}</Badge>
          )}
        </div>
        <CardTitle className="text-xl">{listing.title}</CardTitle>
        <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{listing.quantity}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{listing.pickup_location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Until {format(new Date(listing.available_until), "MMM d, h:mm a")}</span>
        </div>

        {!isProvider && listing.status === "available" && (
          <Button onClick={handleClaim} className="w-full mt-4">
            Claim This Food
          </Button>
        )}

        {isProvider && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={handleDelete} className="flex-1">
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodListingCard;