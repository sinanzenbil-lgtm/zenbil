import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Car, Fuel, Settings, Users } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    transmission: string;
    fuelType: string;
    category: string;
    dailyPrice: number;
    images: string[];
    features: string[];
  };
  searchParams?: string;
}

const transmissionLabels: Record<string, string> = {
  MANUAL: "Manuel",
  AUTOMATIC: "Otomatik",
};

const fuelTypeLabels: Record<string, string> = {
  GASOLINE: "Benzin",
  DIESEL: "Dizel",
  ELECTRIC: "Elektrik",
  HYBRID: "Hibrit",
};

const categoryLabels: Record<string, string> = {
  ECONOMY: "Ekonomi",
  COMFORT: "Konfor",
  LUXURY: "Lüks",
  SUV: "SUV",
};

export function VehicleCard({ vehicle, searchParams }: VehicleCardProps) {
  const imageUrl = vehicle.images[0] || "/placeholder-car.jpg";
  const detailUrl = searchParams
    ? `/araclar/${vehicle.id}?${searchParams}`
    : `/araclar/${vehicle.id}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        <Image
          src={imageUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/95 text-gray-900 hover:bg-white shadow-md">
            {categoryLabels[vehicle.category]}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{vehicle.year}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>{transmissionLabels[vehicle.transmission]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-muted-foreground" />
            <span>{fuelTypeLabels[vehicle.fuelType]}</span>
          </div>
        </div>

        {vehicle.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {vehicle.features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{vehicle.features.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(vehicle.dailyPrice)}
          </p>
          <p className="text-xs text-muted-foreground">günlük</p>
        </div>
        <Button asChild size="lg" className="font-bold">
          <Link href={detailUrl}>SEÇ</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

