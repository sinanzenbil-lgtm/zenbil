import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Calendar, Gift } from "lucide-react";

export default function KampanyalarPage() {
  const campaigns = [
    {
      id: 1,
      title: "Erken Rezervasyon Fırsatı",
      description: "30 gün önceden rezervasyon yapın, %15 indirim kazanın!",
      discount: "15%",
      validUntil: "31 Aralık 2025",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Kurumsal Kiralama İndirimi",
      description: "Kurumsal müşterilerimize özel %20 indirim!",
      discount: "20%",
      validUntil: "Süresiz",
      icon: Gift,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 3,
      title: "Havalimanı Özel",
      description: "Havalimanı şubelerimizden kiralayın, ücretsiz araç teslim hizmeti!",
      discount: "Ücretsiz",
      validUntil: "31 Mart 2026",
      icon: Tag,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 4,
      title: "Yeni Müşteri Kampanyası",
      description: "İlk kiralama için özel %10 indirim!",
      discount: "10%",
      validUntil: "Süresiz",
      icon: Percent,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader showBackButton backUrl="/" backText="Ana Sayfa" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Kampanyalar ve Fırsatlar</h1>
            <p className="text-xl text-muted-foreground">
              Özel indirimler ve avantajlardan yararlanın
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => {
              const Icon = campaign.icon;
              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${campaign.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {campaign.discount}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{campaign.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {campaign.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Geçerlilik: {campaign.validUntil}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-12 bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Kampanyalardan Nasıl Yararlanırım?
              </h2>
              <p className="mb-6">
                Rezervasyon yaparken kampanya kodunu girin veya müşteri temsilcimizle iletişime geçin.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/">
                  Hemen Rezervasyon Yap
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

