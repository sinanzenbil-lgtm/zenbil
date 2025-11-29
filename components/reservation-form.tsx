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
    <Card className="bg-white/98 backdrop-blur-md shadow-2xl border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-800 font-semibold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Lokasyon
              </Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) =>
                  setFormData({ ...formData, locationId: value })
                }
                required
              >
                <SelectTrigger id="location" className="h-14 text-base border-2 hover:border-primary focus:border-primary transition-all rounded-xl bg-gray-50/50">
                  <SelectValue placeholder="Şube seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id} className="cursor-pointer">
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDate" className="text-gray-800 font-semibold text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
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
                className="h-14 text-base border-2 hover:border-primary focus:border-primary transition-all rounded-xl bg-gray-50/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTime" className="text-gray-800 font-semibold text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Alış Saati
              </Label>
              <Select
                value={formData.pickupTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, pickupTime: value })
                }
              >
                <SelectTrigger id="pickupTime" className="h-14 text-base border-2 hover:border-primary focus:border-primary transition-all rounded-xl bg-gray-50/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="cursor-pointer">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnDate" className="text-gray-800 font-semibold text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
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
                className="h-14 text-base border-2 hover:border-primary focus:border-primary transition-all rounded-xl bg-gray-50/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnTime" className="text-gray-800 font-semibold text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Dönüş Saati
              </Label>
              <Select
                value={formData.returnTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, returnTime: value })
                }
              >
                <SelectTrigger id="returnTime" className="h-14 text-base border-2 hover:border-primary focus:border-primary transition-all rounded-xl bg-gray-50/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="cursor-pointer">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full h-16 text-lg font-bold shadow-lg hover:shadow-2xl transition-all rounded-xl bg-gradient-to-r from-[#ff8c00] to-[#ff6600] hover:from-[#ff6600] hover:to-[#ff8c00]" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Müsait Araçları Ara
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
