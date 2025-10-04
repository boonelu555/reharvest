import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, TrendingUp, Package, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProviderStats {
  total_listings: number;
  active_listings: number;
  total_claims: number;
  completed_donations: number;
}

interface ProfileData {
  email: string;
  full_name: string;
  business_name: string;
  business_address: string;
  phone: string;
  verified: boolean;
}

const ProviderProfile = () => {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Fetch stats
    const { data: statsData } = await supabase
      .from("provider_stats")
      .select("*")
      .eq("provider_id", session.user.id)
      .single();

    if (statsData) {
      setStats(statsData);
    }

    setLoading(false);
  };

  if (loading || !profile || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {profile.business_name || profile.full_name}
                {profile.verified && (
                  <Badge className="bg-secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Food Provider</CardDescription>
            </div>
            <Building2 className="h-12 w-12 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile.business_address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{profile.business_address}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{profile.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{profile.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Your Impact
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">{stats.total_listings}</div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Now</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-secondary">{stats.active_listings}</div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-accent">{stats.total_claims}</div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardDescription>Meals Donated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">{stats.completed_donations}</div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Callout */}
      {stats.completed_donations > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-center text-lg">
              🎉 You've helped prevent food waste and supported{" "}
              <span className="font-bold text-primary">{stats.completed_donations}</span>{" "}
              {stats.completed_donations === 1 ? "meal" : "meals"} from going to waste!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProviderProfile;