import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import ResourceCard from "@/components/ResourceCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  type: string;
  name: string;
  location: string;
  quantity?: string;
  description?: string;
  verified: boolean;
  last_updated: string;
}

const Home = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, typeFilter]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("last_updated", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    if (typeFilter !== "all") {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white shadow-card">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Find Healthcare Resources
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Real-time community-verified healthcare resources. Find blood, oxygen, medicines, and more.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="blood_bank">Blood Banks</SelectItem>
              <SelectItem value="oxygen">Oxygen</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="hospital_bed">Hospital Beds</SelectItem>
              <SelectItem value="vaccine_center">Vaccine Centers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No resources found. Be the first to post one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredResources.map((resource) => (
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
    </Layout>
  );
};

export default Home;
