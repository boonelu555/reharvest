import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Heart, CheckCircle, Clock } from "lucide-react";

interface Profile {
  full_name: string;
  email: string;
}

interface Stats {
  total_claims: number;
  meals_received: number;
  pending_pickups: number;
}

const ConsumerProfile = () => {
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
      .select("full_name, email")
      .eq("id", session.user.id)
      .single();

    // Fetch stats
    const { data: statsData } = await supabase
      .from("consumer_stats")
      .select("*")
      .eq("consumer_id", session.user.id)
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
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{profile?.full_name || "Your Profile"}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-3 w-3" />
                {profile?.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Impact Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 font-semibold">
              <Heart className="h-4 w-4 text-primary" />
              Meals Received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats?.meals_received || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Food rescued from waste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Pickups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats?.pending_pickups || 0}</div>
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
            <div className="text-3xl font-bold text-secondary">{stats?.total_claims || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumerProfile;