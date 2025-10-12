import { MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ResourceCardProps {
  id: string;
  type: string;
  name: string;
  location: string;
  quantity?: string;
  verified: boolean;
  lastUpdated: string;
  description?: string;
}

const resourceTypeColors = {
  blood_bank: "bg-destructive/10 text-destructive border-destructive/20",
  oxygen: "bg-primary/10 text-primary border-primary/20",
  medicine: "bg-success/10 text-success border-success/20",
  hospital_bed: "bg-warning/10 text-warning border-warning/20",
  vaccine_center: "bg-accent/10 text-accent border-accent/20",
};

const resourceTypeLabels = {
  blood_bank: "Blood Bank",
  oxygen: "Oxygen",
  medicine: "Medicine",
  hospital_bed: "Hospital Bed",
  vaccine_center: "Vaccine Center",
};

const ResourceCard = ({
  name,
  type,
  location,
  quantity,
  verified,
  lastUpdated,
  description,
}: ResourceCardProps) => {
  const typeColor = resourceTypeColors[type as keyof typeof resourceTypeColors] || "bg-muted text-muted-foreground";
  const typeLabel = resourceTypeLabels[type as keyof typeof resourceTypeLabels] || type;

  return (
    <Card className="hover:shadow-card transition-all duration-300 bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={typeColor} variant="outline">
                {typeLabel}
              </Badge>
              {verified && (
                <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {!verified && (
                <Badge className="bg-warning/10 text-warning border-warning/20" variant="outline">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{location}</span>
        </div>
        
        {quantity && (
          <div className="text-sm">
            <span className="font-medium text-foreground">Availability:</span>{" "}
            <span className="text-muted-foreground">{quantity}</span>
          </div>
        )}

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <Clock className="h-3 w-3" />
          <span>Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
