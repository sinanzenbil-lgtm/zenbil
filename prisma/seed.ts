import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlatılıyor...");

  // Admin kullanıcı oluştur
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: "admin@carbreeze.com" },
    update: {},
    create: {
      email: "admin@carbreeze.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Admin kullanıcı oluşturuldu:", admin.email);

  // Lokasyonlar oluştur
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { id: "sabiha-gokcen" },
      update: {},
      create: {
        id: "sabiha-gokcen",
        name: "Sabiha Gökçen Şube",
        address: "Sabiha Gökçen Havalimanı, Pendik, İstanbul",
        phone: "0530 131 32 58",
        workingHours: "7/24 Açık",
      },
    }),
    prisma.location.upsert({
      where: { id: "istanbul-havalimani" },
      update: {},
      create: {
        id: "istanbul-havalimani",
        name: "İstanbul Havalimanı Şube",
        address: "İstanbul Havalimanı, Arnavutköy, İstanbul",
        phone: "0530 131 32 58",
        workingHours: "7/24 Açık",
      },
    }),
    prisma.location.upsert({
      where: { id: "sisli" },
      update: {},
      create: {
        id: "sisli",
        name: "Şişli Şube",
        address: "Fulya, Mehmetçik Cd. No:48/D, 34394 Şişli/İstanbul",
        phone: "0530 131 32 58",
        workingHours: "08:00 - 22:00",
      },
    }),
  ]);

  console.log("✅ Lokasyonlar oluşturuldu:", locations.length);

  // Örnek araçlar oluştur
  const vehicles = [
    {
      brand: "Renault",
      model: "Clio",
      year: 2023,
      plate: "34 ABC 123",
      transmission: "MANUAL",
      fuelType: "GASOLINE",
      category: "ECONOMY",
      dailyPrice: 800,
      deposit: 2000,
      features: ["Klima", "Bluetooth", "USB Girişi"],
      images: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      ],
      locationIds: ["sabiha-gokcen", "sisli"],
    },
    {
      brand: "Volkswagen",
      model: "Golf",
      year: 2023,
      plate: "34 DEF 456",
      transmission: "AUTOMATIC",
      fuelType: "DIESEL",
      category: "COMFORT",
      dailyPrice: 1200,
      deposit: 3000,
      features: ["Klima", "Cruise Control", "Bluetooth", "Park Sensörü"],
      images: [
        "https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=800",
      ],
      locationIds: ["istanbul-havalimani", "sisli"],
    },
    {
      brand: "BMW",
      model: "3 Serisi",
      year: 2024,
      plate: "34 GHI 789",
      transmission: "AUTOMATIC",
      fuelType: "HYBRID",
      category: "LUXURY",
      dailyPrice: 2500,
      deposit: 5000,
      features: [
        "Deri Koltuk",
        "Navigasyon",
        "Klima",
        "Cruise Control",
        "Park Sensörü",
        "Geri Görüş Kamerası",
      ],
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      ],
      locationIds: ["sabiha-gokcen", "istanbul-havalimani"],
    },
    {
      brand: "Toyota",
      model: "RAV4",
      year: 2023,
      plate: "34 JKL 012",
      transmission: "AUTOMATIC",
      fuelType: "HYBRID",
      category: "SUV",
      dailyPrice: 2000,
      deposit: 4000,
      features: [
        "4x4",
        "Klima",
        "Cruise Control",
        "Bluetooth",
        "Park Sensörü",
        "Geri Görüş Kamerası",
      ],
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
      ],
      locationIds: ["sabiha-gokcen", "istanbul-havalimani", "sisli"],
    },
    {
      brand: "Fiat",
      model: "Egea",
      year: 2023,
      plate: "34 MNO 345",
      transmission: "MANUAL",
      fuelType: "GASOLINE",
      category: "ECONOMY",
      dailyPrice: 750,
      deposit: 2000,
      features: ["Klima", "Bluetooth"],
      images: [
        "https://images.unsplash.com/photo-1583267746897-ec2e90e6e6e8?w=800",
      ],
      locationIds: ["sisli"],
    },
  ];

  for (const vehicleData of vehicles) {
    const { locationIds, ...vehicleInfo } = vehicleData;

    const vehicle = await prisma.vehicle.create({
      data: {
        ...vehicleInfo,
        transmission: vehicleInfo.transmission as any,
        fuelType: vehicleInfo.fuelType as any,
        category: vehicleInfo.category as any,
      },
    });

    // Araç-lokasyon ilişkilerini oluştur
    for (const locationId of locationIds) {
      await prisma.vehicleLocation.create({
        data: {
          vehicleId: vehicle.id,
          locationId: locationId,
        },
      });
    }

    console.log(`✅ Araç oluşturuldu: ${vehicle.brand} ${vehicle.model}`);
  }

  console.log("🎉 Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
