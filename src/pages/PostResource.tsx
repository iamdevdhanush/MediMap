import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const resourceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name too long"),
  type: z.enum(["blood_bank", "oxygen", "medicine", "hospital_bed", "vaccine_center"]),
  location: z.string().trim().min(1, "Location is required").max(200, "Location too long"),
  quantity: z.string().trim().max(100, "Quantity too long").optional(),
  description: z.string().trim().max(1000, "Description too long").optional(),
});

const PostResource = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    quantity: "",
    description: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to post resources");
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const validatedData = resourceSchema.parse(formData);

      // First, verify with AI
      const verifyResponse = await supabase.functions.invoke("verify-resource", {
        body: validatedData,
      });

      if (verifyResponse.error) {
        throw new Error("AI verification failed");
      }

      const verification = verifyResponse.data;

      // Insert resource with AI verification results
      const { error: insertError } = await supabase.from("resources").insert({
        owner_id: user.id,
        name: validatedData.name,
        type: validatedData.type,
        location: validatedData.location,
        quantity: validatedData.quantity || null,
        description: validatedData.description || null,
        verified: verification.verified,
        ai_notes: verification.notes,
      });

      if (insertError) throw insertError;

      // Award credibility points
      const { data: profile } = await supabase
        .from("profiles")
        .select("credibility_points")
        .eq("id", user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ credibility_points: profile.credibility_points + 5 })
          .eq("id", user.id);

        // Update leaderboard
        await supabase.rpc("update_leaderboard");
      }

      toast.success(
        verification.verified
          ? "Resource posted and verified!"
          : "Resource posted! Pending verification."
      );
      navigate("/");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to post resource");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Post a Healthcare Resource</CardTitle>
            <CardDescription>
              Share resources with the community. AI will verify your post automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Resource Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., City Blood Bank"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Resource Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_bank">Blood Bank</SelectItem>
                    <SelectItem value="oxygen">Oxygen</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="hospital_bed">Hospital Bed</SelectItem>
                    <SelectItem value="vaccine_center">Vaccine Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (City / Pincode) *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Mumbai, 400001"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Availability / Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., A+, B+, O+ available"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Contact info, timings, special notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  maxLength={1000}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Resource"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PostResource;
