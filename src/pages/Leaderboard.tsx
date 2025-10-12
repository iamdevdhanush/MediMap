import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Award, Medal } from "lucide-react";
import { toast } from "sonner";

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("credibility_points", { ascending: false })
        .limit(50);

      if (error) throw error;
      setTopUsers(data || []);
    } catch (error: any) {
      toast.error("Failed to load leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-warning" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-6 w-6 text-warning/70" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-card">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Leaderboard</h1>
          <p className="text-lg text-white/90">
            Top contributors making a difference
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : topUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No contributors yet. Be the first!
              </div>
            ) : (
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      index < 3
                        ? "bg-gradient-card border border-primary/20"
                        : "bg-muted/30"
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className={`h-12 w-12 ${index < 3 ? "border-2 border-primary" : ""}`}>
                      <AvatarFallback className={index === 0 ? "bg-gradient-hero text-white" : ""}>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      {user.location && (
                        <p className="text-sm text-muted-foreground truncate">{user.location}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-bold text-lg">{user.credibility_points}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;
