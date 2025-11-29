"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { VehicleCard } from "@/components/vehicle-card";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "lucide-react";

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    transmission: "all",
    fuelType: "all",
  });

  const locationId = searchParams.get("locationId");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");
  const pickupTime = searchParams.get("pickupTime");
  const returnTime = searchParams.get("returnTime");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      let url = "/api/vehicles";

      if (locationId && pickupDate && returnDate && pickupTime && returnTime) {
        url = `/api/vehicles/available?locationId=${locationId}&pickupDate=${pickupDate}&returnDate=${returnDate}&pickupTime=${pickupTime}&returnTime=${returnTime}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filters.category !== "all" && vehicle.category !== filters.category) {
      return false;
    }
    if (
      filters.transmission !== "all" &&
      vehicle.transmission !== filters.transmission
    ) {
      return false;
    }
    if (filters.fuelType !== "all" && vehicle.fuelType !== filters.fuelType) {
      return false;
    }
    return true;
  });

  const searchParamsString = searchParams.toString();

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader showBackButton backUrl="/" backText="Ana Sayfa" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {locationId ? "Müsait Araçlar" : "Tüm Araçlar"}
          </h1>
          {locationId && (
            <p className="text-muted-foreground">
              Seçtiğiniz tarihlerde müsait araçlar listeleniyor
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Filtreler</h3>
                </div>

                <div className="space-y-2">
                  <Label>Araç Sınıfı</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="all" className="cursor-pointer">Tümü</SelectItem>
                      <SelectItem value="ECONOMY" className="cursor-pointer">Ekonomi</SelectItem>
                      <SelectItem value="COMFORT" className="cursor-pointer">Konfor</SelectItem>
                      <SelectItem value="LUXURY" className="cursor-pointer">Lüks</SelectItem>
                      <SelectItem value="SUV" className="cursor-pointer">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Şanzıman</Label>
                  <Select
                    value={filters.transmission}
                    onValueChange={(value) =>
                      setFilters({ ...filters, transmission: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="all" className="cursor-pointer">Tümü</SelectItem>
                      <SelectItem value="MANUAL" className="cursor-pointer">Manuel</SelectItem>
                      <SelectItem value="AUTOMATIC" className="cursor-pointer">Otomatik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Yakıt Tipi</Label>
                  <Select
                    value={filters.fuelType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, fuelType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="all" className="cursor-pointer">Tümü</SelectItem>
                      <SelectItem value="GASOLINE" className="cursor-pointer">Benzin</SelectItem>
                      <SelectItem value="DIESEL" className="cursor-pointer">Dizel</SelectItem>
                      <SelectItem value="ELECTRIC" className="cursor-pointer">Elektrik</SelectItem>
                      <SelectItem value="HYBRID" className="cursor-pointer">Hibrit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setFilters({
                      category: "all",
                      transmission: "all",
                      fuelType: "all",
                    })
                  }
                >
                  Filtreleri Temizle
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Araçlar yükleniyor...</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Araç bulunamadı</h3>
                <p className="text-muted-foreground mb-4">
                  Seçtiğiniz kriterlere uygun araç bulunmamaktadır.
                </p>
                <Button asChild>
                  <Link href="/">Yeni Arama Yap</Link>
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    searchParams={searchParamsString}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
