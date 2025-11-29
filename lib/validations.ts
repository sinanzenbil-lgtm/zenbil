import { z } from "zod";

export const reservationSchema = z.object({
  vehicleId: z.string().min(1, "Araç seçimi zorunludur"),
  locationId: z.string().min(1, "Lokasyon seçimi zorunludur"),
  pickupDate: z.date({
    required_error: "Alış tarihi zorunludur",
  }),
  returnDate: z.date({
    required_error: "Dönüş tarihi zorunludur",
  }),
  pickupTime: z.string().min(1, "Alış saati zorunludur"),
  returnTime: z.string().min(1, "Dönüş saati zorunludur"),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  idNumber: z.string().min(11, "TC Kimlik No veya Pasaport No giriniz"),
  notes: z.string().optional(),
}).refine((data) => data.returnDate > data.pickupDate, {
  message: "Dönüş tarihi, alış tarihinden sonra olmalıdır",
  path: ["returnDate"],
});

export const vehicleSchema = z.object({
  brand: z.string().min(2, "Marka en az 2 karakter olmalıdır"),
  model: z.string().min(2, "Model en az 2 karakter olmalıdır"),
  year: z.number().min(2000, "Yıl 2000'den büyük olmalıdır").max(new Date().getFullYear() + 1),
  plate: z.string().min(5, "Plaka en az 5 karakter olmalıdır"),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuelType: z.enum(["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"]),
  category: z.enum(["ECONOMY", "COMFORT", "LUXURY", "SUV"]),
  dailyPrice: z.number().min(0, "Günlük fiyat 0'dan büyük olmalıdır"),
  deposit: z.number().min(0, "Depozito 0'dan büyük olmalıdır"),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  locationIds: z.array(z.string()).min(1, "En az bir lokasyon seçilmelidir"),
  isActive: z.boolean().default(true),
});

export const locationSchema = z.object({
  name: z.string().min(3, "Şube adı en az 3 karakter olmalıdır"),
  address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  workingHours: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});
