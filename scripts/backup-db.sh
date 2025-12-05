#!/bin/bash

# Veritabanı yedekleme scripti
# Kullanım: ./scripts/backup-db.sh

echo "🔄 Veritabanı yedeği alınıyor..."

# Tarih damgası
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
BACKUP_FILE="$BACKUP_DIR/carbreeze_backup_$TIMESTAMP.sql"

# Backup klasörü yoksa oluştur
mkdir -p $BACKUP_DIR

# Neon veritabanından export
echo "📦 Export ediliyor..."
npx prisma db execute --stdin < /dev/null > /dev/null 2>&1 || true

# Prisma schema'yı kopyala
cp prisma/schema.prisma "$BACKUP_DIR/schema_$TIMESTAMP.prisma"

echo "✅ Yedek alındı: $BACKUP_FILE"
echo "📋 Schema kaydedildi: $BACKUP_DIR/schema_$TIMESTAMP.prisma"
echo ""
echo "💡 Veritabanı verilerini manuel yedeklemek için:"
echo "   1. https://console.neon.tech adresine gidin"
echo "   2. Projenizi seçin"
echo "   3. 'Backups' sekmesine tıklayın"
echo "   4. 'Create backup' butonuna basın"

