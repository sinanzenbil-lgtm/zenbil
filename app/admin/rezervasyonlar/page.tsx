"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye, Search, Plus } from "lucide-react";

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

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, reservations]);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations");
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.firstName.toLowerCase().includes(search) ||
          r.lastName.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          r.phone.includes(search) ||
          r.id.toLowerCase().includes(search)
      );
    }

    setFilteredReservations(filtered);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rezervasyon Yönetimi</h1>
          <p className="text-muted-foreground">
            Tüm rezervasyonları görüntüleyin ve yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/rezervasyonlar/yeni">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Rezervasyon
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Rezervasyon Listesi ({filteredReservations.length})</CardTitle>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="PENDING">Beklemede</SelectItem>
                  <SelectItem value="CONFIRMED">Onaylandı</SelectItem>
                  <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                  <SelectItem value="CANCELLED">İptal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Arama kriterlerine uygun rezervasyon bulunamadı"
                  : "Henüz rezervasyon bulunmamaktadır"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Araç</TableHead>
                  <TableHead>Lokasyon</TableHead>
                  <TableHead>Tarihler</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {reservation.firstName} {reservation.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {reservation.vehicle.brand} {reservation.vehicle.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.vehicle.plate}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{reservation.location.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          <span className="text-muted-foreground">Alış:</span>{" "}
                          {formatDate(new Date(reservation.pickupDate))}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Dönüş:</span>{" "}
                          {formatDate(new Date(reservation.returnDate))}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(reservation.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[reservation.status]}>
                        {statusLabels[reservation.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/rezervasyonlar/${reservation.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
