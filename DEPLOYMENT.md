# CarBreeze Deployment Rehberi

## 🚀 Vercel ile Deploy (Önerilen)

### 1. GitHub'a Yükleyin
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin [github-repo-url]
git push -u origin main
```

### 2. Vercel'e Deploy
1. https://vercel.com adresine gidin
2. GitHub ile giriş yapın
3. "New Project" → Repository'nizi seçin
4. Environment Variables ekleyin:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_URL`: https://your-domain.vercel.app
   - `NEXTAUTH_SECRET`: Rastgele güvenli string (32+ karakter)

### 3. Database Kurulumu
**Seçenek A: Vercel Postgres**
- Vercel dashboard → Storage → Create Database
- PostgreSQL seçin
- Connection string'i kopyalayın

**Seçenek B: Supabase (Ücretsiz)**
1. https://supabase.com → New Project
2. Database password belirleyin
3. Settings → Database → Connection String
4. Vercel'e ekleyin

### 4. Database Migration
Vercel dashboard → Project → Settings → Environment Variables ekledikten sonra:
- Vercel otomatik olarak `npm run build` çalıştırır
- Build sırasında Prisma migrate çalışır

### 5. Seed Data
İlk deploy sonrası, Vercel Functions kullanarak seed çalıştırın:
```bash
# Local'den production'a bağlanarak
DATABASE_URL="[production-url]" npx prisma db seed
```

---

## 🌐 Netlify ile Deploy

### 1. Build Ayarları
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18

### 2. Environment Variables
Netlify dashboard → Site settings → Environment variables:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

---

## 💻 VPS ile Deploy (DigitalOcean, AWS, Hetzner)

### 1. Sunucu Gereksinimleri
- Ubuntu 22.04 LTS
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2

### 2. Kurulum
```bash
# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL kurulumu
sudo apt install postgresql postgresql-contrib

# PM2 kurulumu
sudo npm install -g pm2

# Nginx kurulumu
sudo apt install nginx
```

### 3. Database Oluşturma
```bash
sudo -u postgres psql
CREATE DATABASE carbreeze;
CREATE USER carbreeze_user WITH PASSWORD 'güçlü-şifre';
GRANT ALL PRIVILEGES ON DATABASE carbreeze TO carbreeze_user;
\q
```

### 4. Proje Kurulumu
```bash
cd /var/www
git clone [repo-url] carbreeze
cd carbreeze
npm install
```

### 5. Environment Variables
```bash
nano .env
```
```
DATABASE_URL="postgresql://carbreeze_user:şifre@localhost:5432/carbreeze"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="rastgele-güvenli-string"
```

### 6. Build ve Migrate
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run build
```

### 7. PM2 ile Başlatma
```bash
pm2 start npm --name "carbreeze" -- start
pm2 save
pm2 startup
```

### 8. Nginx Konfigürasyonu
```bash
sudo nano /etc/nginx/sites-available/carbreeze
```
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/carbreeze /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. SSL Sertifikası (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📋 Checklist

### Deploy Öncesi
- [ ] `.env` dosyası `.gitignore`'da
- [ ] Production database hazır
- [ ] NEXTAUTH_SECRET oluşturuldu
- [ ] Domain ayarları yapıldı (A record)

### Deploy Sonrası
- [ ] Database seed çalıştırıldı
- [ ] Admin girişi test edildi
- [ ] Rezervasyon sistemi test edildi
- [ ] Email gönderimi test edildi (varsa)
- [ ] SSL sertifikası aktif

---

## 🔐 Güvenlik

### NEXTAUTH_SECRET Oluşturma
```bash
openssl rand -base64 32
```

### Production Database
- Güçlü şifre kullanın
- SSL bağlantı zorunlu
- Firewall kuralları ayarlayın
- Düzenli backup alın

---

## 🆘 Sorun Giderme

### Build Hatası
```bash
# Cache temizle
rm -rf .next
npm run build
```

### Database Bağlantı Hatası
- Connection string'i kontrol edin
- Database'in erişilebilir olduğundan emin olun
- SSL gerekliyse `?sslmode=require` ekleyin

### 404 Hatası
- Next.js routing'i kontrol edin
- `.next` klasörü build edilmiş mi?
- Nginx proxy ayarları doğru mu?

---

## 📞 Destek

Sorun yaşarsanız:
1. Vercel/Netlify loglarını kontrol edin
2. `npm run build` local'de çalışıyor mu?
3. Database bağlantısı test edin

---

## 🎉 Başarılı Deploy!

Site canlıya alındıktan sonra:
- Admin paneline giriş yapın: `/admin/giris`
- Email: admin@carbreeze.com
- Şifre: admin123 (ÖNEMLİ: Hemen değiştirin!)


