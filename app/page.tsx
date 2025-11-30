import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReservationForm } from "@/components/reservation-form";
import { SiteHeader } from "@/components/site-header";
import { Car, Shield, Clock, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-20 min-h-[600px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              Güvenilir Araç Kiralama Hizmeti
            </h1>
            <p className="text-xl text-white mb-6" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.8)' }}>
              İstanbul'un en iyi lokasyonlarında kaliteli araçlar, uygun fiyatlar
            </p>
          </div>

          {/* Reservation Form */}
          <div className="max-w-4xl mx-auto">
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* Kampanyalar Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kampanyalar ve Fırsatlar</h2>
            <p className="text-xl text-muted-foreground">
              Özel indirimlerden yararlanın
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl">
              <div className="relative w-full aspect-square">
                <Image
                  src="/kampanya-erken-rezervasyon.jpg"
                  alt="Erken Rezervasyon - %15 İndirim"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl">
              <div className="relative w-full aspect-square">
                <Image
                  src="/kampanya-havalimani.jpg"
                  alt="Havalimanı Özel - Ücretsiz Teslimat"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl">
              <div className="relative w-full aspect-square">
                <Image
                  src="/kampanya-kurumsal.jpg"
                  alt="Kurumsal Kiralama - %20 İndirim"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          </div>
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/kampanyalar">
                Tüm Kampanyaları Gör
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Neden CarBreeze?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Geniş Araç Filosu</h3>
              <p className="text-gray-600">
                Ekonomiden lükse, her bütçeye uygun araç seçenekleri
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenli ve Temiz</h3>
              <p className="text-gray-600">
                Tüm araçlarımız düzenli bakımlı ve sigortalıdır
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">7/24 Destek</h3>
              <p className="text-gray-600">
                Havalimanı şubelerimizde kesintisiz hizmet
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kolay Teslimat</h3>
              <p className="text-gray-600">
                3 farklı şubemizden dilediğinizi seçin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CarBreeze</span>
              </div>
              <p className="text-gray-400">
                İstanbul'un güvenilir araç kiralama hizmeti
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Şubelerimiz</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sabiha Gökçen Havalimanı</li>
                <li>İstanbul Havalimanı</li>
                <li>Şişli Merkez</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@carbreeze.com.tr</li>
                <li>Tel: 0530 131 32 58</li>
                <li>Adres: Fulya, Mehmetçik Cd. No:48/D, 34394 Şişli/İstanbul</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarBreeze. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
