import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function IletisimPage() {
  const locations = [
    {
      name: "Sabiha Gökçen Havalimanı Şube",
      address: "Sabiha Gökçen Havalimanı, Pendik, İstanbul",
      phone: "0530 131 32 58",
      email: "sabihagokcen@carbreeze.com",
      hours: "7/24 Açık",
    },
    {
      name: "İstanbul Havalimanı Şube",
      address: "İstanbul Havalimanı, Arnavutköy, İstanbul",
      phone: "0530 131 32 58",
      email: "istanbulairport@carbreeze.com",
      hours: "7/24 Açık",
    },
    {
      name: "Şişli Merkez Şube",
      address: "Fulya, Mehmetçik Cd. No:48/D, 34394 Şişli/İstanbul",
      phone: "0530 131 32 58",
      email: "sisli@carbreeze.com",
      hours: "08:00 - 22:00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader showBackButton backUrl="/" backText="Ana Sayfa" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">İletişim</h1>
            <p className="text-xl text-muted-foreground">
              Bize ulaşın, size yardımcı olmaktan mutluluk duyarız
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span>{location.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${location.phone}`} className="text-sm hover:text-primary">
                      {location.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${location.email}`} className="text-sm hover:text-primary">
                      {location.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{location.hours}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Genel İletişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Çağrı Merkezi</p>
                    <a href="tel:05301313258" className="text-muted-foreground hover:text-primary">
                      0530 131 32 58
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:info@carbreeze.com.tr" className="text-muted-foreground hover:text-primary">
                      info@carbreeze.com.tr
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Çalışma Saatleri</p>
                    <p className="text-muted-foreground">Pazartesi - Pazar: 7/24</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sık Sorulan Sorular</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">Rezervasyon nasıl yapılır?</p>
                  <p className="text-sm text-muted-foreground">
                    Anasayfamızdaki formu doldurarak veya çağrı merkezimizi arayarak rezervasyon yapabilirsiniz.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Hangi belgeler gerekli?</p>
                  <p className="text-sm text-muted-foreground">
                    Geçerli ehliyet, kimlik belgesi ve kredi kartı gereklidir.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">İptal politikası nedir?</p>
                  <p className="text-sm text-muted-foreground">
                    Rezervasyon tarihinden 24 saat öncesine kadar ücretsiz iptal yapabilirsiniz.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Hemen Rezervasyon Yapın
              </h2>
              <p className="mb-6">
                İstanbul'un en iyi lokasyonlarında kaliteli araçlar sizi bekliyor.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/">
                  Rezervasyon Yap
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

