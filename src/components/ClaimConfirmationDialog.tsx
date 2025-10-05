import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Package } from "lucide-react";
import { format } from "date-fns";

interface ClaimConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  listing: {
    title: string;
    description: string;
    quantity: string;
    category: string;
    pickup_location: string;
    available_until: string;
    image_url?: string;
  } | null;
  isLoading?: boolean;
}

const ClaimConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  listing,
  isLoading = false,
}: ClaimConfirmationDialogProps) => {
  if (!listing) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Food Claim</AlertDialogTitle>
          <AlertDialogDescription>
            Please review the details before claiming this food item.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {listing.image_url && (
            <div className="w-full h-40 rounded-lg overflow-hidden">
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <div className="flex gap-2 mb-2">
                {listing.category && (
                  <Badge variant="secondary">{listing.category}</Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg">{listing.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {listing.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Quantity:</span>
                <span>{listing.quantity}</span>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">Pickup Location:</span>
                  <p className="text-muted-foreground">{listing.pickup_location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Available Until:</span>
                <span>
                  {format(new Date(listing.available_until), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Important:
            </p>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>You'll receive pickup details via email</li>
              <li>Please arrive during the available time</li>
              <li>Contact the provider if you can't make it</li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Claiming..." : "Confirm Claim"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClaimConfirmationDialog;
