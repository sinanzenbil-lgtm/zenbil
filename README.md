# CarBreeze - Araç Kiralama Sistemi

Modern ve kullanıcı dostu bir araç kiralama web uygulaması. Next.js 14, TypeScript, Tailwind CSS ve PostgreSQL ile geliştirilmiştir.

## 🚀 Özellikler

### Müşteri Tarafı
- ✅ Modern ve responsive ana sayfa
- ✅ Gelişmiş rezervasyon formu (lokasyon, tarih ve saat seçimi)
- ✅ Müsait araçları listeleme ve filtreleme
- ✅ Detaylı araç bilgileri ve görsel galeri
- ✅ Gerçek zamanlı müsaitlik kontrolü
- ✅ Kolay rezervasyon oluşturma
- ✅ Rezervasyon onay sayfası

### Yönetim Paneli
- ✅ Güvenli admin girişi (NextAuth.js)
- ✅ Dashboard ve istatistikler
- ✅ Araç yönetimi (CRUD işlemleri)
- ✅ Rezervasyon yönetimi
- ✅ Rezervasyon durum güncelleme
- ✅ Lokasyon/Şube yönetimi
- ✅ Araç-lokasyon ilişkilendirme

### Teknik Özellikler
- ✅ Çakışan rezervasyonları engelleme
- ✅ Tarih ve saat bazlı müsaitlik kontrolü
- ✅ Lokasyon bazlı araç filtreleme
- ✅ Responsive tasarım (mobile-first)
- ✅ Form validasyonları
- ✅ Toast bildirimleri
- ✅ SEO optimizasyonu

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Form Management**: React Hook Form + Zod
- **Date Handling**: date-fns

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Veritabanını yapılandırın:**

`.env` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/carbreeze?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. **Veritabanını oluşturun:**
```bash
npx prisma generate
npx prisma db push
```

4. **Seed data'yı yükleyin:**
```bash
npm run prisma:seed
```

Bu komut şunları oluşturur:
- Admin kullanıcı (email: admin@carbreeze.com, şifre: admin123)
- 3 lokasyon (Sabiha Gökçen, İstanbul Havalimanı, Şişli)
- 5 örnek araç

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📱 Kullanım

### Müşteri Tarafı
1. Ana sayfada lokasyon, tarih ve saat seçin
2. "Müsait Araçları Ara" butonuna tıklayın
3. Filtreleri kullanarak araçları inceleyin
4. Beğendiğiniz aracın detaylarına gidin
5. Rezervasyon formunu doldurun
6. Rezervasyonunuzu tamamlayın

### Admin Paneli
1. `/admin/giris` adresine gidin
2. Admin bilgileriyle giriş yapın
   - Email: admin@carbreeze.com
   - Şifre: admin123
3. Dashboard'dan sistemi yönetin:
   - Araç ekleyin/düzenleyin/silin
   - Rezervasyonları görüntüleyin ve durumlarını güncelleyin
   - Lokasyonları yönetin

## 🗂️ Proje Yapısı

```
/app
  /(public)           # Müşteri tarafı sayfalar
    /page.tsx         # Ana sayfa
    /araclar          # Araç listeleme ve detay
    /rezervasyon      # Rezervasyon işlemleri
  /admin              # Yönetim paneli
    /giris            # Admin girişi
    /araclar          # Araç yönetimi
    /rezervasyonlar   # Rezervasyon yönetimi
    /lokasyonlar      # Lokasyon yönetimi
  /api                # API routes
    /auth             # NextAuth
    /vehicles         # Araç API'leri
    /reservations     # Rezervasyon API'leri
    /locations        # Lokasyon API'leri
/components
  /ui                 # shadcn/ui bileşenleri
  /reservation-form.tsx
  /vehicle-card.tsx
/lib
  /prisma.ts          # Prisma client
  /auth.ts            # NextAuth config
  /utils.ts           # Yardımcı fonksiyonlar
  /validations.ts     # Zod şemaları
  /availability.ts    # Müsaitlik kontrolü
/prisma
  /schema.prisma      # Veritabanı şeması
  /seed.ts            # Seed data
```

## 🗄️ Veritabanı Şeması

### Tablolar
- **Admin**: Yönetici kullanıcıları
- **Location**: Şubeler/Lokasyonlar
- **Vehicle**: Araçlar
- **VehicleLocation**: Araç-Lokasyon ilişkisi (many-to-many)
- **Reservation**: Rezervasyonlar

## 🔐 Güvenlik

- Admin rotaları middleware ile korunur
- Şifreler bcrypt ile hashlenir
- NextAuth.js ile session yönetimi
- Input validasyonları (client & server)
- SQL injection koruması (Prisma ORM)

## 🎨 UI/UX

- Modern ve temiz arayüz
- Responsive tasarım (mobile, tablet, desktop)
- Loading states ve skeleton loaders
- Error handling ve kullanıcı bildirimleri
- Kolay navigasyon
- Erişilebilir form elemanları

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

CarBreeze - 2024

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Sorularınız için: info@carbreeze.com
