import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, Award, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ResourceCard from "@/components/ResourceCard";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userResources, setUserResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: resourcesData, error: resourcesError } = await supabase
        .from("resources")
        .select("*")
        .eq("owner_id", session.user.id)
        .order("created_at", { ascending: false });

      if (resourcesError) throw resourcesError;
      setUserResources(resourcesData || []);
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-primary">
                  <AvatarFallback className="bg-gradient-hero text-white text-2xl">
                    {profile?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{profile?.name}</h2>
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-medium">Credibility Points</span>
                </div>
                <p className="text-3xl font-bold">{profile?.credibility_points || 0}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Trophy className="h-5 w-5" />
                  <span className="text-sm font-medium">Rank</span>
                </div>
                <p className="text-3xl font-bold">#{profile?.rank || "-"}</p>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Resources Posted</div>
                <p className="text-3xl font-bold">{userResources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Posted Resources</h3>
          {userResources.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">You haven't posted any resources yet.</p>
              <Button onClick={() => navigate("/post")} className="mt-4">
                Post Your First Resource
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  type={resource.type}
                  name={resource.name}
                  location={resource.location}
                  quantity={resource.quantity}
                  description={resource.description}
                  verified={resource.verified}
                  lastUpdated={resource.last_updated}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
