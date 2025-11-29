"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const transmissionLabels: Record<string, string> = {
  MANUAL: "Manuel",
  AUTOMATIC: "Otomatik",
};

const categoryLabels: Record<string, string> = {
  ECONOMY: "Ekonomi",
  COMFORT: "Konfor",
  LUXURY: "Lüks",
  SUV: "SUV",
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Araçlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu aracı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Silme işlemi başarısız");
      }

      toast.success("Araç başarıyla silindi");
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Araç silinirken bir hata oluştu");
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Araç Yönetimi</h1>
          <p className="text-muted-foreground">
            Tüm araçları görüntüleyin ve yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/araclar/yeni">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Araç Ekle
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Araç Listesi ({vehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Henüz araç eklenmemiş
              </p>
              <Button asChild>
                <Link href="/admin/araclar/yeni">İlk Aracı Ekle</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Araç</TableHead>
                  <TableHead>Plaka</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Şanzıman</TableHead>
                  <TableHead>Günlük Fiyat</TableHead>
                  <TableHead>Lokasyonlar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.brand} {vehicle.model}
                      <div className="text-sm text-muted-foreground">
                        {vehicle.year}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.plate}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {categoryLabels[vehicle.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transmissionLabels[vehicle.transmission]}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(vehicle.dailyPrice)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {vehicle.locations?.length || 0} şube
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                        {vehicle.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link href={`/admin/araclar/${vehicle.id}/duzenle`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
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
