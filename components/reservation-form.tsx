"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Clock } from "lucide-react";

const locations = [
  { id: "sabiha-gokcen", name: "Sabiha Gökçen Havalimanı" },
  { id: "istanbul-havalimani", name: "İstanbul Havalimanı" },
  { id: "sisli", name: "Şişli Şube" },
];

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

export function ReservationForm() {
  const router = useRouter();
  
  // Default tarihleri hesapla
  const getDefaultDates = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
    return {
      pickupDate: tomorrow.toISOString().split("T")[0],
      returnDate: threeDaysLater.toISOString().split("T")[0],
    };
  };
  
  const defaultDates = getDefaultDates();
  
  const [formData, setFormData] = useState({
    locationId: "",
    pickupDate: defaultDates.pickupDate,
    returnDate: defaultDates.returnDate,
    pickupTime: "10:00",
    returnTime: "10:00",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lokasyon seçilmemişse uyarı göster
    if (!formData.locationId) {
      alert("Lütfen bir lokasyon seçin");
      return;
    }
    
    const params = new URLSearchParams({
      locationId: formData.locationId,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      pickupTime: formData.pickupTime,
      returnTime: formData.returnTime,
    });

    router.push(`/araclar?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Lokasyon */}
          <div className="space-y-3">
            <Label htmlFor="location" className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Lokasyon
            </Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) =>
                setFormData({ ...formData, locationId: value })
              }
              required
            >
              <SelectTrigger id="location" className="h-14 text-base border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all rounded-xl bg-white hover:bg-gray-50">
                <SelectValue placeholder="Şube seçin" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 rounded-xl shadow-xl border-gray-200">
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id} className="cursor-pointer hover:bg-orange-50 rounded-lg">
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alış Tarihi ve Saati */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="pickupDate" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Alış Tarihi
              </Label>
              <Input
                id="pickupDate"
                type="date"
                min={today}
                value={formData.pickupDate}
                onChange={(e) =>
                  setFormData({ ...formData, pickupDate: e.target.value })
                }
                className="h-14 text-base border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all rounded-xl bg-white hover:bg-gray-50"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="pickupTime" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Alış Saati
              </Label>
              <Select
                value={formData.pickupTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, pickupTime: value })
                }
              >
                <SelectTrigger id="pickupTime" className="h-14 text-base border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all rounded-xl bg-white hover:bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 rounded-xl shadow-xl border-gray-200">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="cursor-pointer hover:bg-orange-50 rounded-lg">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dönüş Tarihi ve Saati */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="returnDate" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Dönüş Tarihi
              </Label>
              <Input
                id="returnDate"
                type="date"
                min={formData.pickupDate || today}
                value={formData.returnDate}
                onChange={(e) =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
                className="h-14 text-base border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all rounded-xl bg-white hover:bg-gray-50"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="returnTime" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Dönüş Saati
              </Label>
              <Select
                value={formData.returnTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, returnTime: value })
                }
              >
                <SelectTrigger id="returnTime" className="h-14 text-base border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all rounded-xl bg-white hover:bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 rounded-xl shadow-xl border-gray-200">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="cursor-pointer hover:bg-orange-50 rounded-lg">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full h-16 text-lg font-bold shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02]" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Müsait Araçları Ara
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
