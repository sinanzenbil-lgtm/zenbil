"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewReservationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tcNo: "",
    licenseNo: "",
    locationId: "",
    vehicleId: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "10:00",
    returnTime: "10:00",
    customPrice: "",
  });

  useEffect(() => {
    fetchLocations();
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (formData.locationId && formData.pickupDate && formData.returnDate) {
      checkAvailability();
    }
  }, [formData.locationId, formData.pickupDate, formData.returnDate, formData.pickupTime, formData.returnTime]);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      const data = await response.json();
      setLocations(data.locations || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const checkAvailability = async () => {
    try {
      const params = new URLSearchParams({
        locationId: formData.locationId,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        pickupTime: formData.pickupTime,
        returnTime: formData.returnTime,
      });

      const response = await fetch(`/api/vehicles/available?${params}`);
      const data = await response.json();
      setAvailableVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  const calculateTotalPrice = () => {
    // Eğer custom fiyat girilmişse onu kullan
    if (formData.customPrice) {
      return parseFloat(formData.customPrice) || 0;
    }

    // Aksi halde otomatik hesapla
    if (!formData.vehicleId || !formData.pickupDate || !formData.returnDate) {
      return 0;
    }

    const vehicle = vehicles.find((v) => v.id === formData.vehicleId);
    if (!vehicle) return 0;

    const pickup = new Date(formData.pickupDate + "T" + formData.pickupTime);
    const returnDate = new Date(formData.returnDate + "T" + formData.returnTime);
    const days = Math.ceil(
      (returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)
    );

    return days * vehicle.dailyPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let totalPrice = 0;
      
      // Manuel fiyat varsa onu kullan, yoksa otomatik hesapla
      if (formData.customPrice) {
        totalPrice = parseFloat(formData.customPrice) || 0;
      } else {
        totalPrice = calculateTotalPrice();
      }

      // En az fiyat kontrolü
      if (totalPrice <= 0) {
        toast.error("Lütfen fiyat girin veya araç seçin");
        setLoading(false);
        return;
      }

      // Boş alanları temizle - sadece dolu olanları gönder
      const reservationData: any = {
        totalPrice,
        status: "CONFIRMED",
        deposit: 0,
      };

      // Sadece dolu alanları ekle (boş string değil)
      if (formData.firstName?.trim()) reservationData.firstName = formData.firstName.trim();
      if (formData.lastName?.trim()) reservationData.lastName = formData.lastName.trim();
      if (formData.email?.trim()) reservationData.email = formData.email.trim();
      if (formData.phone?.trim()) reservationData.phone = formData.phone.trim();
      if (formData.tcNo?.trim()) reservationData.tcNo = formData.tcNo.trim();
      if (formData.licenseNo?.trim()) reservationData.licenseNo = formData.licenseNo.trim();
      if (formData.locationId?.trim()) reservationData.locationId = formData.locationId.trim();
      if (formData.vehicleId?.trim()) reservationData.vehicleId = formData.vehicleId.trim();
      
      // Tarih ve saat alanları - sadece dolu olanları ekle
      if (formData.pickupDate?.trim()) {
        reservationData.pickupDate = formData.pickupDate.trim();
        if (formData.pickupTime?.trim()) {
          reservationData.pickupTime = formData.pickupTime.trim();
        }
      }
      
      if (formData.returnDate?.trim()) {
        reservationData.returnDate = formData.returnDate.trim();
        if (formData.returnTime?.trim()) {
          reservationData.returnTime = formData.returnTime.trim();
        }
      }

      console.log("Gönderilen veri:", reservationData); // Debug için

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Rezervasyon oluşturulamadı");
      }

      toast.success("Rezervasyon başarıyla oluşturuldu!");
      router.push("/admin/rezervasyonlar");
    } catch (error: any) {
      console.error("Rezervasyon oluşturma hatası:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const totalPrice = calculateTotalPrice();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/rezervasyonlar">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Yeni Rezervasyon</h1>
          <p className="text-muted-foreground">
            Yeni rezervasyon oluşturun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Opsiyonel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Opsiyonel"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Opsiyonel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Opsiyonel"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tcNo">TC Kimlik No</Label>
                <Input
                  id="tcNo"
                  value={formData.tcNo}
                  onChange={(e) =>
                    setFormData({ ...formData, tcNo: e.target.value })
                  }
                  placeholder="Opsiyonel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNo">Ehliyet No</Label>
                <Input
                  id="licenseNo"
                  value={formData.licenseNo}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNo: e.target.value })
                  }
                  placeholder="Opsiyonel"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rezervasyon Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="locationId">Lokasyon</Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) =>
                  setFormData({ ...formData, locationId: value, vehicleId: "" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Lokasyon seçin (Opsiyonel)" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white" position="popper" sideOffset={4}>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupDate">Alış Tarihi</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  min={today}
                  value={formData.pickupDate}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupDate: e.target.value, vehicleId: "" })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupTime">Alış Saati</Label>
                <Select
                  value={formData.pickupTime}
                  onValueChange={(value) =>
                    setFormData({ ...formData, pickupTime: value, vehicleId: "" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white" position="popper" sideOffset={4}>
                    {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="returnDate">Dönüş Tarihi</Label>
                <Input
                  id="returnDate"
                  type="date"
                  min={formData.pickupDate || today}
                  value={formData.returnDate}
                  onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value, vehicleId: "" })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnTime">Dönüş Saati</Label>
                <Select
                  value={formData.returnTime}
                  onValueChange={(value) =>
                    setFormData({ ...formData, returnTime: value, vehicleId: "" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white" position="popper" sideOffset={4}>
                    {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Araç</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) =>
                  setFormData({ ...formData, vehicleId: value })
                }
                disabled={!formData.locationId || !formData.pickupDate || !formData.returnDate}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    !formData.locationId || !formData.pickupDate || !formData.returnDate
                      ? "Önce lokasyon ve tarih seçin"
                      : availableVehicles.length === 0
                      ? "Müsait araç yok"
                      : "Araç seçin (Opsiyonel)"
                  } />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white" position="popper" sideOffset={4}>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                        <span className="text-xs text-muted-foreground">Plaka: {vehicle.plate} • {vehicle.dailyPrice}₺/gün</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customPrice">Toplam Fiyat (₺)</Label>
              <Input
                id="customPrice"
                type="number"
                value={formData.customPrice}
                onChange={(e) =>
                  setFormData({ ...formData, customPrice: e.target.value })
                }
                placeholder="Manuel fiyat girin veya otomatik hesaplansın"
              />
              {!formData.customPrice && totalPrice > 0 && (
                <p className="text-sm text-muted-foreground">
                  Otomatik hesaplanan: {totalPrice.toLocaleString("tr-TR")}₺
                </p>
              )}
            </div>

            {totalPrice > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Toplam Tutar:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalPrice.toLocaleString("tr-TR")}₺
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/rezervasyonlar">İptal</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Oluşturuluyor..." : "Rezervasyon Oluştur"}
          </Button>
        </div>
      </form>
    </div>
  );
}

