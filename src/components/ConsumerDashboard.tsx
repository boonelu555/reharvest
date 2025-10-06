import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ConsumerProfile from "./ConsumerProfile";
import ListingsView from "./ListingsView";
import type { FoodListing } from "@/types/listings";
import ClaimConfirmationDialog from "./ClaimConfirmationDialog";

// Using shared FoodListing type

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("food_listings")
      .select("*")
      .eq("status", "available")
      .gte("available_until", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load food listings",
        variant: "destructive",
      });
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleClaimFromMap = (listing: FoodListing) => {
    setSelectedListing(listing);
    setShowClaimDialog(true);
  };

  const handleConfirmClaim = async () => {
    if (!selectedListing) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsClaimLoading(true);

    try {
      const currentQuantity = parseInt(selectedListing.quantity) || 1;
      const newQuantity = Math.max(0, currentQuantity - 1);

      const { error: claimError } = await supabase.from("claims").insert({
        listing_id: selectedListing.id,
        consumer_id: session.user.id,
        status: "pending",
      });

      if (claimError) throw claimError;

      const updateData: any = {
        quantity: newQuantity.toString(),
      };

      if (newQuantity === 0) {
        updateData.status = "claimed";
      }

      const { error: updateError } = await supabase
        .from("food_listings")
        .update(updateData)
        .eq("id", selectedListing.id);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Food claimed! Check your email for pickup details.",
      });
      
      setShowClaimDialog(false);
      setSelectedListing(null);
      fetchListings();
    } catch (error: any) {
      console.error("Claim error:", error);
      toast({
        title: "Error",
        description: error.message?.includes("duplicate")
          ? "You've already claimed this item"
          : "Failed to claim listing",
        variant: "destructive",
      });
    } finally {
      setIsClaimLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">reharvest</span>
            <span className="text-sm text-muted-foreground ml-2">Find Food</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <ConsumerProfile />

        <div className="mb-8 mt-12">
          <h2 className="text-3xl font-bold mb-2">Available Food Near You</h2>
          <p className="text-muted-foreground">Find and claim fresh food from local businesses</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading available food...</p>
          </div>
        ) : (
          <ListingsView listings={listings} onClaimClick={handleClaimFromMap} />
        )}
      </div>

      {/* Claim Confirmation Dialog for Map View */}
      <ClaimConfirmationDialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
        onConfirm={handleConfirmClaim}
        listing={selectedListing}
        isLoading={isClaimLoading}
      />
    </div>
  );
};

export default ConsumerDashboard;