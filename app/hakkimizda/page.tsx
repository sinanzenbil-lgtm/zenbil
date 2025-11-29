import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Shield, Heart } from "lucide-react";

export default function HakkimizdaPage() {
  const values = [
    {
      icon: Users,
      title: "Müşteri Memnuniyeti",
      description: "Müşterilerimizin memnuniyeti bizim için her şeyden önce gelir.",
    },
    {
      icon: Award,
      title: "Kalite Garantisi",
      description: "Tüm araçlarımız düzenli bakımlı ve en yüksek standartlarda.",
    },
    {
      icon: Shield,
      title: "Güvenilirlik",
      description: "Şeffaf fiyatlandırma ve güvenli kiralama deneyimi.",
    },
    {
      icon: Heart,
      title: "Tutkumuz",
      description: "Araç kiralama sektöründe mükemmellik tutkusu.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader showBackButton backUrl="/" backText="Ana Sayfa" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
            <p className="text-xl text-muted-foreground">
              İstanbul'un güvenilir araç kiralama hizmeti
            </p>
          </div>

          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg mb-4">
                  <strong>CarBreeze</strong>, İstanbul'da araç kiralama sektöründe müşteri memnuniyetini 
                  ön planda tutan, güvenilir ve kaliteli hizmet anlayışıyla faaliyet gösteren bir firmadır.
                </p>
                <p className="mb-4">
                  2020 yılında kurulan şirketimiz, geniş araç filosu ve stratejik konumlardaki şubelerimizle 
                  müşterilerimize en iyi hizmeti sunmayı hedeflemektedir. Sabiha Gökçen Havalimanı, 
                  İstanbul Havalimanı ve Şişli merkez lokasyonlarımızda 7/24 hizmet vermekteyiz.
                </p>
                <p className="mb-4">
                  Ekonomi sınıfından lüks araçlara kadar geniş bir yelpazede hizmet sunan CarBreeze, 
                  her bütçeye uygun araç seçenekleri ile müşterilerinin ihtiyaçlarına en uygun çözümleri sunmaktadır.
                </p>
                <p>
                  Tüm araçlarımız düzenli bakımlı, sigortalı ve en yüksek güvenlik standartlarına uygun olarak 
                  hazırlanmaktadır. Müşteri memnuniyeti odaklı yaklaşımımız ve şeffaf fiyatlandırma politikamızla 
                  sektörde fark yaratmaya devam ediyoruz.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Değerlerimiz</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                          <p className="text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Bizimle Çalışmak İster misiniz?
              </h2>
              <p className="mb-6">
                Ekibimize katılmak veya iş ortaklığı için bizimle iletişime geçin.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/iletisim">
                  İletişime Geç
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

