import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import ResourceCard from "@/components/ResourceCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

const BloodBanks = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery]);

  const fetchBloodBanks = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .in("type", ["blood_bank", "oxygen"])
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
    if (!searchQuery) {
      setFilteredResources(resources);
      return;
    }

    const filtered = resources.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.quantity && r.quantity.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredResources(filtered);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white shadow-card">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Blood Banks & Emergency Resources
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Find blood banks and emergency oxygen supplies near you
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or blood type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No emergency resources found matching your search
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

export default BloodBanks;
