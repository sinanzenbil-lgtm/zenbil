# 🔄 CarBreeze Geri Yükleme Talimatları

## Site Bozulduğunda Ne Yapmalı?

### 1️⃣ Kodu Geri Yükle (GitHub'dan)

```bash
# Eski bir versiyona dön
git log --oneline  # Commit listesini gör
git checkout <commit-id>  # İstediğin versiyona dön

# Ya da son çalışan haline dön
git reset --hard HEAD~1  # 1 commit geri
git push --force  # Vercel'e gönder
```

### 2️⃣ Veritabanını Geri Yükle (Neon)

**Otomatik Yedekten:**
1. https://console.neon.tech adresine git
2. Projenizi seçin
3. "Backups" sekmesine tıklayın
4. İstediğiniz yedeği seçip "Restore" yapın

**Manuel Yedekten:**
```bash
# Eğer SQL dump'ınız varsa
psql $DATABASE_URL < backup.sql
```

### 3️⃣ Vercel Deployment'ı Geri Al

1. https://vercel.com/carbreezes-projects/carbreeze
2. "Deployments" sekmesine git
3. Çalışan eski bir deployment'ı seç
4. "..." menüsünden "Promote to Production" seç

### 4️⃣ Hızlı Test

```bash
# Local'de test et
npm run dev

# Canlıya push et
git push
```

## 🆘 Acil Durum Komutları

### Tüm değişiklikleri iptal et
```bash
git reset --hard origin/main
```

### Son çalışan versiyonu bul
```bash
git log --all --oneline --graph
```

### Vercel'i yeniden deploy et
```bash
vercel --prod
```

## 📞 Yardım

Sorun devam ederse:
1. GitHub'daki commit geçmişine bak
2. Vercel deployment loglarını kontrol et
3. Neon veritabanı bağlantısını test et

---
**Not:** Her önemli değişiklikten önce yedek alın!

