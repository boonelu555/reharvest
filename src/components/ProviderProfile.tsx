import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Phone, Mail, TrendingUp, Package, CheckCircle } from "lucide-react";

interface Profile {
  business_name: string;
  business_address: string;
  phone: string;
  email: string;
  verified: boolean;
}

interface Stats {
  total_listings: number;
  active_listings: number;
  total_claims: number;
  completed_donations: number;
}

const ProviderProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("business_name, business_address, phone, email, verified")
      .eq("id", session.user.id)
      .single();

    // Fetch stats
    const { data: statsData } = await supabase
      .from("provider_stats")
      .select("*")
      .eq("provider_id", session.user.id)
      .single();

    setProfile(profileData);
    setStats(statsData);
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{profile?.business_name || "Your Business"}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  {profile?.verified ? (
                    <Badge className="bg-secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Provider
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending Verification</Badge>
                  )}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile?.business_address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.business_address}</span>
            </div>
          )}
          {profile?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile?.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats?.total_listings || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Active Listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats?.active_listings || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Total Claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats?.total_claims || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Meals Donated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats?.completed_donations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Impact on your community</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderProfile;