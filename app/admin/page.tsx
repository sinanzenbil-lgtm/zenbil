"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Car, Calendar, CheckCircle, Clock, TrendingUp, DollarSign, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeReservations: 0,
    pendingReservations: 0,
    todayPickups: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    confirmedRevenue: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (allReservations.length > 0) {
      calculateStats(allReservations);
    }
  }, [selectedMonth, allReservations]);

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

      setAllReservations(reservations);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayPickups = reservations.filter((r: any) => {
        if (!r.pickupDate) return false;
        const pickupDate = new Date(r.pickupDate);
        pickupDate.setHours(0, 0, 0, 0);
        return pickupDate.getTime() === today.getTime();
      }).length;

      setStats(prev => ({
        ...prev,
        totalVehicles: vehicles.length,
        activeReservations: reservations.filter(
          (r: any) => r.status === "CONFIRMED"
        ).length,
        pendingReservations: reservations.filter(
          (r: any) => r.status === "PENDING"
        ).length,
        todayPickups,
      }));

      calculateStats(reservations);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reservations: any[]) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    // Seçili ay cirosu (tüm statüler)
    const monthRevenue = reservations
      .filter((r: any) => {
        if (!r.createdAt) return false;
        const createdDate = new Date(r.createdAt);
        return createdDate >= firstDayOfMonth && createdDate <= lastDayOfMonth;
      })
      .reduce((sum: number, r: any) => sum + (r.totalPrice || 0), 0);
    
    // Seçili ay onaylanmış ciro
    const confirmedRevenue = reservations
      .filter((r: any) => {
        if (!r.createdAt) return false;
        const createdDate = new Date(r.createdAt);
        return createdDate >= firstDayOfMonth && 
               createdDate <= lastDayOfMonth && 
               (r.status === 'CONFIRMED' || r.status === 'COMPLETED');
      })
      .reduce((sum: number, r: any) => sum + (r.totalPrice || 0), 0);

    // Seçili ay bekleyen ciro
    const pendingRevenue = reservations
      .filter((r: any) => {
        if (!r.createdAt) return false;
        const createdDate = new Date(r.createdAt);
        return createdDate >= firstDayOfMonth && 
               createdDate <= lastDayOfMonth && 
               r.status === 'PENDING';
      })
      .reduce((sum: number, r: any) => sum + (r.totalPrice || 0), 0);

    setStats(prev => ({
      ...prev,
      totalRevenue: monthRevenue,
      monthRevenue: confirmedRevenue,
      confirmedRevenue: pendingRevenue,
    }));
  };

  // Son 12 ayı oluştur
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
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

      {/* Ciro İstatistikleri */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Ciro İstatistikleri</h2>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-64 bg-white">
              <SelectValue placeholder="Ay seçin" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {generateMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-green-900">
              Seçili Ay Cirosu
            </CardTitle>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-900 mb-2">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-sm text-green-700">
              {generateMonthOptions().find(m => m.value === selectedMonth)?.label} - Tüm rezervasyonlar
            </p>
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
