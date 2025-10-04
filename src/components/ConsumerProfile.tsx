import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Heart, Package, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConsumerStats {
  total_claims: number;
  meals_received: number;
  pending_pickups: number;
}

interface ProfileData {
  email: string;
  full_name: string;
  privacy_mode: boolean;
}

const ConsumerProfile = () => {
  const [stats, setStats] = useState<ConsumerStats | null>(null);
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
      .from("consumer_stats")
      .select("*")
      .eq("consumer_id", session.user.id)
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
                {profile.full_name}
                {profile.privacy_mode && (
                  <Badge variant="outline" className="text-xs">
                    Private
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Community Member</CardDescription>
            </div>
            <User className="h-12 w-12 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{profile.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Your Journey
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">{stats.total_claims}</div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardDescription>Meals Received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">{stats.meals_received}</div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Pickups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-accent">{stats.pending_pickups}</div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Callout */}
      {stats.meals_received > 0 && (
        <Card className="bg-gradient-to-r from-secondary/20 to-accent/20 border-secondary/30">
          <CardContent className="pt-6">
            <p className="text-center text-lg">
              🌱 You've saved{" "}
              <span className="font-bold text-primary">{stats.meals_received}</span>{" "}
              {stats.meals_received === 1 ? "meal" : "meals"} from going to waste while supporting local businesses!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsumerProfile;