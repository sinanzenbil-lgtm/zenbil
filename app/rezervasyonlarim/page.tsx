"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Car, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export default function MyReservationsPage() {
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Lütfen email adresinizi girin");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/reservations/by-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Rezervasyonlar getirilemedi");
      }

      setReservations(data.reservations || []);
      
      if (data.reservations.length === 0) {
        toast.info("Bu email adresine ait rezervasyon bulunamadı");
      }
    } catch (error: any) {
      console.error("Error fetching reservations:", error);
      toast.error(error.message || "Rezervasyonlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader showBackButton backUrl="/" backText="Ana Sayfa" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Rezervasyonlarım</h1>
            <Button asChild size="lg">
              <Link href="/">
                <Car className="w-4 h-4 mr-2" />
                Yeni Rezervasyon Ekle
              </Link>
            </Button>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rezervasyonlarınızı Görüntüleyin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="email" className="sr-only">Email Adresi</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Rezervasyon yaparken kullandığınız email adresini girin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <Button type="submit" disabled={loading} className="h-12">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Aranıyor..." : "Ara"}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-2">
                Rezervasyon yaparken kullandığınız email adresini girerek rezervasyonlarınızı görüntüleyebilirsiniz.
              </p>
            </CardContent>
          </Card>

          {/* Reservations List */}
          {searched && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Rezervasyon Bulunamadı</h3>
                    <p className="text-muted-foreground mb-4">
                      Bu email adresine ait aktif rezervasyon bulunmamaktadır.
                    </p>
                    <Button asChild>
                      <Link href="/">Yeni Rezervasyon Yap</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {reservation.vehicle.brand} {reservation.vehicle.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Rezervasyon No: {reservation.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <Badge className={statusColors[reservation.status]}>
                          {statusLabels[reservation.status]}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Alış</p>
                          <p className="font-semibold">
                            {new Date(reservation.pickupDate).toLocaleDateString("tr-TR")} - {reservation.pickupTime}
                          </p>
                          <p className="text-sm">{reservation.location.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Dönüş</p>
                          <p className="font-semibold">
                            {new Date(reservation.returnDate).toLocaleDateString("tr-TR")} - {reservation.returnTime}
                          </p>
                          <p className="text-sm">{reservation.location.name}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Toplam Tutar</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(reservation.totalPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Müşteri</p>
                          <p className="font-semibold">
                            {reservation.firstName} {reservation.lastName}
                          </p>
                          <p className="text-sm">{reservation.phone}</p>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Notlar:</p>
                          <p className="text-sm">{reservation.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

