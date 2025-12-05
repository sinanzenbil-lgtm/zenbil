"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    plate: "",
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    category: "ECONOMY",
    dailyPrice: 0,
    deposit: 0,
    features: [] as string[],
    images: [""],
    locationIds: [] as string[],
    isActive: true,
  });

  const featureOptions = [
    "Klima",
    "Bluetooth",
    "USB Girişi",
    "Cruise Control",
    "Park Sensörü",
    "Geri Görüş Kamerası",
    "Navigasyon",
    "Deri Koltuk",
    "GPS",
    "4x4",
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      const data = await response.json();
      setLocations(data.locations || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting vehicle data:", formData);
      
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images.filter((img) => img.trim() !== ""),
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Araç eklenemedi");
      }

      toast.success("Araç başarıyla eklendi");
      router.push("/admin/araclar");
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      toast.error(error.message || "Araç eklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const toggleLocation = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      locationIds: prev.locationIds.includes(locationId)
        ? prev.locationIds.filter((id) => id !== locationId)
        : [...prev.locationIds, locationId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/araclar">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Yeni Araç Ekle</h1>
          <p className="text-muted-foreground">Sisteme yeni araç ekleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Araç Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marka *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Yıl *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plate">Plaka *</Label>
                    <Input
                      id="plate"
                      value={formData.plate}
                      onChange={(e) =>
                        setFormData({ ...formData, plate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Şanzıman *</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        setFormData({ ...formData, transmission: value })
                      }
                    >
                      <SelectTrigger id="transmission">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="MANUAL" className="cursor-pointer">Manuel</SelectItem>
                        <SelectItem value="AUTOMATIC" className="cursor-pointer">Otomatik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Yakıt Tipi *</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fuelType: value })
                      }
                    >
                      <SelectTrigger id="fuelType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="GASOLINE" className="cursor-pointer">Benzin</SelectItem>
                        <SelectItem value="DIESEL" className="cursor-pointer">Dizel</SelectItem>
                        <SelectItem value="ELECTRIC" className="cursor-pointer">Elektrik</SelectItem>
                        <SelectItem value="HYBRID" className="cursor-pointer">Hibrit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Araç Sınıfı *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="ECONOMY" className="cursor-pointer">Ekonomi</SelectItem>
                      <SelectItem value="COMFORT" className="cursor-pointer">Konfor</SelectItem>
                      <SelectItem value="LUXURY" className="cursor-pointer">Lüks</SelectItem>
                      <SelectItem value="SUV" className="cursor-pointer">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyPrice">Günlük Fiyat (TL) *</Label>
                    <Input
                      id="dailyPrice"
                      type="number"
                      value={formData.dailyPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dailyPrice: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deposit">Depozito (TL) *</Label>
                    <Input
                      id="deposit"
                      type="number"
                      value={formData.deposit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deposit: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Görsel URL</Label>
                    <Input
                      id="images"
                      placeholder="https://example.com/image.jpg"
                      value={formData.images[0]}
                      onChange={(e) =>
                        setFormData({ ...formData, images: [e.target.value] })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Araç görseli için URL girin
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        veya
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageFile">Resim Yükle</Label>
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Dosyayı base64'e çevir veya upload et
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, images: [reader.result as string] });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Bilgisayarınızdan resim seçin (JPG, PNG, WEBP)
                    </p>
                  </div>

                  {formData.images[0] && (
                    <div className="space-y-2">
                      <Label>Önizleme</Label>
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={formData.images[0]}
                          alt="Araç görseli önizleme"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Görsel+Yüklenemedi";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Özellikler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {featureOptions.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <Label htmlFor={feature} className="cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lokasyonlar *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={location.id}
                      checked={formData.locationIds.includes(location.id)}
                      onCheckedChange={() => toggleLocation(location.id)}
                    />
                    <Label htmlFor={location.id} className="cursor-pointer">
                      {location.name}
                    </Label>
                  </div>
                ))}
                {formData.locationIds.length === 0 && (
                  <p className="text-sm text-destructive">
                    En az bir lokasyon seçmelisiniz
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Durum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked as boolean })
                    }
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Aktif (Kiralama için müsait)
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || formData.locationIds.length === 0}
              >
                {loading ? "Kaydediliyor..." : "Aracı Kaydet"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href="/admin/araclar">İptal</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
