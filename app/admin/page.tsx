"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Car, Calendar, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeReservations: 0,
    pendingReservations: 0,
    todayPickups: 0,
  });
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vehiclesRes, reservationsRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/reservations"),
      ]);

      const vehiclesData = await vehiclesRes.json();
      const reservationsData = await reservationsRes.json();

      const vehicles = vehiclesData.vehicles || [];
      const reservations = reservationsData.reservations || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayPickups = reservations.filter((r: any) => {
        const pickupDate = new Date(r.pickupDate);
        pickupDate.setHours(0, 0, 0, 0);
        return pickupDate.getTime() === today.getTime();
      }).length;

      setStats({
        totalVehicles: vehicles.length,
        activeReservations: reservations.filter(
          (r: any) => r.status === "CONFIRMED"
        ).length,
        pendingReservations: reservations.filter(
          (r: any) => r.status === "PENDING"
        ).length,
        todayPickups,
      });

      setRecentReservations(reservations.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Araç kiralama sistemi genel bakış
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Araç</CardTitle>
            <Car className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Rezervasyon
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReservations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Onay Bekleyen
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Bugünkü Teslimler
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayPickups}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Son Rezervasyonlar</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReservations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Henüz rezervasyon bulunmamaktadır
            </p>
          ) : (
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold">
                        {reservation.firstName} {reservation.lastName}
                      </p>
                      <Badge variant={statusColors[reservation.status]}>
                        {statusLabels[reservation.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reservation.vehicle.brand} {reservation.vehicle.model} •{" "}
                      {reservation.location.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reservation.pickupDate).toLocaleDateString("tr-TR")} -{" "}
                      {new Date(reservation.returnDate).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatCurrency(reservation.totalPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(new Date(reservation.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
