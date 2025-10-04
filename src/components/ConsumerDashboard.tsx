import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, LogOut, Map, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  latitude: number;
  longitude: number;
  provider_id: string;
  image_url?: string;
}

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Food Near You</h1>
          <p className="text-muted-foreground">Find and claim fresh food from local businesses</p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading available food...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="text-xl font-semibold mb-2">No food available right now</h3>
                <p className="text-muted-foreground">Check back soon for new listings</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <FoodListingCard
                    key={listing.id}
                    listing={listing}
                    onUpdate={fetchListings}
                    isProvider={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Map View Coming Soon</h3>
              <p className="text-muted-foreground">
                Interactive map with food locations will be available soon
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsumerDashboard;