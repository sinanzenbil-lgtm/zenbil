"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CheckCircle, Car, Calendar, MapPin, User, Mail, Phone } from "lucide-react";

export default function ReservationSuccessPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id");
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/reservations/public?id=${reservationId}`);
      const data = await response.json();
      setReservation(data.reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Rezervasyon Başarılı!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Rezervasyonunuz başarıyla oluşturuldu. En kısa sürede size dönüş yapacağız.
          </p>
        </CardHeader>

        {reservation && (
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Rezervasyon No</p>
              <p className="text-2xl font-bold font-mono">{reservation.id.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">
                    {reservation.vehicle.brand} {reservation.vehicle.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.vehicle.year} - {reservation.vehicle.plate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">{reservation.location.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.location.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Alış</p>
                      <p className="font-semibold">
                        {new Date(reservation.pickupDate).toLocaleDateString("tr-TR")}
                      </p>
                      <p className="text-sm">{reservation.pickupTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dönüş</p>
                      <p className="font-semibold">
                        {new Date(reservation.returnDate).toLocaleDateString("tr-TR")}
                      </p>
                      <p className="text-sm">{reservation.returnTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">
                    {reservation.firstName} {reservation.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.idNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">{reservation.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">{reservation.phone}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Toplam Tutar</span>
                <span className="font-bold">{formatCurrency(reservation.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Depozito</span>
                <span className="font-bold">{formatCurrency(reservation.deposit)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Durum</span>
                <span className="font-semibold text-orange-600">Onay Bekliyor</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Önemli:</strong> Rezervasyonunuz onaylandığında email adresinize bilgilendirme gönderilecektir. 
                Lütfen araç teslim alırken kimlik belgenizi ve ehliyetinizi yanınızda bulundurun.
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/">Ana Sayfaya Dön</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/araclar">Yeni Rezervasyon</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
