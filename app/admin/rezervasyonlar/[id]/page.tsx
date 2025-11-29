"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Car, Calendar, MapPin, User, Mail, Phone, CreditCard } from "lucide-react";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
};

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReservation();
  }, [params.id]);

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/reservations?id=${params.id}`);
      const data = await response.json();
      setReservation(data.reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      toast.error("Rezervasyon bilgileri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Durum güncellenemedi");
      }

      toast.success("Rezervasyon durumu güncellendi");
      fetchReservation();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Durum güncellenirken bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!reservation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Rezervasyon bulunamadı</h2>
        <Button asChild>
          <Link href="/admin/rezervasyonlar">Rezervasyonlara Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/rezervasyonlar">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Rezervasyon Detayı</h1>
          <p className="text-muted-foreground">
            Rezervasyon No: {reservation.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <Badge variant={statusColors[reservation.status]} className="text-base px-4 py-2">
          {statusLabels[reservation.status]}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Araç Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Araç</span>
                <span className="font-semibold">
                  {reservation.vehicle.brand} {reservation.vehicle.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yıl</span>
                <span className="font-semibold">{reservation.vehicle.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plaka</span>
                <span className="font-semibold">{reservation.vehicle.plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Günlük Fiyat</span>
                <span className="font-semibold">
                  {formatCurrency(reservation.vehicle.dailyPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Reservation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Rezervasyon Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Alış Tarihi & Saati</p>
                  <p className="font-semibold">
                    {formatDate(new Date(reservation.pickupDate))}
                  </p>
                  <p className="text-sm">{reservation.pickupTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dönüş Tarihi & Saati</p>
                  <p className="font-semibold">
                    {formatDate(new Date(reservation.returnDate))}
                  </p>
                  <p className="text-sm">{reservation.returnTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Lokasyon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Şube</span>
                <span className="font-semibold">{reservation.location.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adres</span>
                <span className="font-semibold text-right">
                  {reservation.location.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefon</span>
                <span className="font-semibold">{reservation.location.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {reservation.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reservation.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Müşteri Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ad Soyad</p>
                <p className="font-semibold">
                  {reservation.firstName} {reservation.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {reservation.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {reservation.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">TC / Pasaport No</p>
                <p className="font-semibold">{reservation.idNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Ödeme Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toplam Tutar</span>
                <span className="font-bold text-primary">
                  {formatCurrency(reservation.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Depozito</span>
                <span className="font-semibold">
                  {formatCurrency(reservation.deposit)}
                </span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Oluşturulma: {formatDate(new Date(reservation.createdAt))}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Durum Güncelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={reservation.status}
                onValueChange={handleStatusChange}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Beklemede</SelectItem>
                  <SelectItem value="CONFIRMED">Onaylandı</SelectItem>
                  <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                  <SelectItem value="CANCELLED">İptal</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Rezervasyon durumunu değiştirmek için yukarıdan seçim yapın
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
