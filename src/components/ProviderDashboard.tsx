import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CreateListingDialog from "./CreateListingDialog";
import FoodListingCard from "./FoodListingCard";

interface FoodListing {
  id: string;
  title: string;
  description: string;
  quantity: string;
  category: string;
  pickup_location: string;
  available_until: string;
  status: string;
  created_at: string;
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("food_listings")
      .select("*")
      .eq("provider_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load listings",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">reharvest</span>
            <span className="text-sm text-muted-foreground ml-2">Provider Dashboard</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Food Listings</h1>
            <p className="text-muted-foreground">Manage your surplus food donations</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Listing
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No listings yet</CardTitle>
              <CardDescription>
                Create your first listing to start sharing surplus food with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <FoodListingCard
                key={listing.id}
                listing={listing}
                onUpdate={fetchListings}
                isProvider
              />
            ))}
          </div>
        )}
      </div>

      <CreateListingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchListings}
      />
    </div>
  );
};

export default ProviderDashboard;