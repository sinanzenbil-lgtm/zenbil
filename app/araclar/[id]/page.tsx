"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, calculateTotalPrice } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { Check } from "lucide-react";
import { toast } from "sonner";

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

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

function VehicleDetailPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    locationId: searchParams.get("locationId") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    returnDate: searchParams.get("returnDate") || "",
    pickupTime: searchParams.get("pickupTime") || "10:00",
    returnTime: searchParams.get("returnTime") || "10:00",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    notes: "",
  });

  useEffect(() => {
    fetchVehicle();
  }, [params.id]);

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/vehicles?id=${params.id}`);
      const data = await response.json();
      setVehicle(data.vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      toast.error("Araç bilgileri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const totalPrice = calculateTotalPrice(
        vehicle.dailyPrice,
        new Date(formData.pickupDate),
        new Date(formData.returnDate)
      );

      const reservationData = {
        vehicleId: vehicle.id,
        ...formData,
        pickupDate: new Date(formData.pickupDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
        totalPrice,
        deposit: vehicle.deposit,
      };

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error("Rezervasyon oluşturulamadı");
      }

      const data = await response.json();
      toast.success("Rezervasyon başarıyla oluşturuldu!");
      router.push(`/rezervasyon/basarili?id=${data.reservation.id}`);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Rezervasyon oluşturulurken bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Araç bulunamadı</h2>
          <Button asChild>
            <Link href="/araclar">Araçlara Dön</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = formData.pickupDate && formData.returnDate
    ? calculateTotalPrice(
        vehicle.dailyPrice,
        new Date(formData.pickupDate),
        new Date(formData.returnDate)
      )
    : 0;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader showBackButton backUrl={`/araclar?${searchParams.toString()}`} backText="Araçlara Dön" />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {vehicle.brand} {vehicle.model}
                    </h1>
                    <p className="text-muted-foreground">{vehicle.year}</p>
                  </div>
                  <Badge className="text-base px-3 py-1">
                    {categoryLabels[vehicle.category]}
                  </Badge>
                </div>

                {/* Vehicle Image */}
                <div className="relative h-96 rounded-lg overflow-hidden mb-6">
                  <Image
                    src={vehicle.images[0] || "/placeholder-car.jpg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Specifications */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-muted-foreground">Şanzıman</span>
                    <span className="font-semibold">
                      {transmissionLabels[vehicle.transmission]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-muted-foreground">Yakıt Tipi</span>
                    <span className="font-semibold">
                      {fuelTypeLabels[vehicle.fuelType]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-muted-foreground">Günlük Fiyat</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(vehicle.dailyPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-muted-foreground">Depozito</span>
                    <span className="font-semibold">
                      {formatCurrency(vehicle.deposit)}
                    </span>
                  </div>
                </div>

                {/* Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Özellikler</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {vehicle.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Locations */}
                {vehicle.locations && vehicle.locations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Müsait Lokasyonlar
                    </h3>
                    <div className="space-y-2">
                      {vehicle.locations.map((vl: any) => (
                        <div
                          key={vl.id}
                          className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                        >
                          <span>{vl.location.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {vl.location.phone}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reservation Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Rezervasyon Yap</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationId">Lokasyon *</Label>
                    <Select
                      value={formData.locationId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, locationId: value })
                      }
                      required
                    >
                      <SelectTrigger id="locationId">
                        <SelectValue placeholder="Şube seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicle.locations?.map((vl: any) => (
                          <SelectItem key={vl.locationId} value={vl.locationId}>
                            {vl.location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Alış Tarihi *</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        min={today}
                        value={formData.pickupDate}
                        onChange={(e) =>
                          setFormData({ ...formData, pickupDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupTime">Alış Saati *</Label>
                      <Select
                        value={formData.pickupTime}
                        onValueChange={(value) =>
                          setFormData({ ...formData, pickupTime: value })
                        }
                      >
                        <SelectTrigger id="pickupTime">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="returnDate">Dönüş Tarihi *</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        min={formData.pickupDate || today}
                        value={formData.returnDate}
                        onChange={(e) =>
                          setFormData({ ...formData, returnDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnTime">Dönüş Saati *</Label>
                      <Select
                        value={formData.returnTime}
                        onValueChange={(value) =>
                          setFormData({ ...formData, returnTime: value })
                        }
                      >
                        <SelectTrigger id="returnTime">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Müşteri Bilgileri</h4>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ad *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({ ...formData, firstName: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Soyad *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({ ...formData, lastName: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+90 5XX XXX XX XX"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idNumber">TC Kimlik / Pasaport No *</Label>
                        <Input
                          id="idNumber"
                          value={formData.idNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, idNumber: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {totalPrice > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Günlük Fiyat</span>
                        <span>{formatCurrency(vehicle.dailyPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Depozito</span>
                        <span>{formatCurrency(vehicle.deposit)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Toplam</span>
                        <span className="text-primary">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "İşleniyor..." : "Rezervasyon Yap"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehicleDetailPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <VehicleDetailPageContent />
    </Suspense>
  );
}
