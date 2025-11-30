import { prisma } from "./prisma";
import { parse, isWithinInterval, areIntervalsOverlapping } from "date-fns";

export interface AvailabilityParams {
  locationId: string;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
  returnTime: string;
  excludeReservationId?: string;
}

export async function checkVehicleAvailability(
  vehicleId: string,
  params: AvailabilityParams
): Promise<boolean> {
  const { pickupDate, returnDate, pickupTime, returnTime, excludeReservationId } = params;

  // Tarih ve saatleri birleştir
  const requestedPickup = combineDateAndTime(pickupDate, pickupTime);
  const requestedReturn = combineDateAndTime(returnDate, returnTime);

  // Bu araç için çakışan rezervasyonları kontrol et
  const overlappingReservations = await prisma.reservation.findMany({
    where: {
      vehicleId,
      id: excludeReservationId ? { not: excludeReservationId } : undefined,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
  });

  // Çakışma kontrolü
  for (const reservation of overlappingReservations) {
    // Skip rezervasyonları eğer gerekli alanlar yoksa
    if (!reservation.pickupDate || !reservation.returnDate || 
        !reservation.pickupTime || !reservation.returnTime) {
      continue;
    }

    const existingPickup = combineDateAndTime(
      reservation.pickupDate,
      reservation.pickupTime
    );
    const existingReturn = combineDateAndTime(
      reservation.returnDate,
      reservation.returnTime
    );

    const hasOverlap = areIntervalsOverlapping(
      { start: requestedPickup, end: requestedReturn },
      { start: existingPickup, end: existingReturn },
      { inclusive: false }
    );

    if (hasOverlap) {
      return false;
    }
  }

  return true;
}

export async function getAvailableVehicles(params: AvailabilityParams) {
  const { locationId } = params;

  // Bu lokasyondaki tüm araçları getir
  const vehicleLocations = await prisma.vehicleLocation.findMany({
    where: {
      locationId,
      vehicle: {
        isActive: true,
      },
    },
    include: {
      vehicle: {
        include: {
          locations: {
            include: {
              location: true,
            },
          },
        },
      },
    },
  });

  // Her araç için müsaitlik kontrolü yap
  const availableVehicles = [];

  for (const vl of vehicleLocations) {
    if (!vl.vehicle) continue;

    const isAvailable = await checkVehicleAvailability(vl.vehicle.id, params);

    if (isAvailable) {
      availableVehicles.push(vl.vehicle);
    }
  }

  return availableVehicles;
}

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export function calculateTotalPrice(
  dailyPrice: number,
  pickupDate: Date,
  returnDate: Date
): number {
  const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return dailyPrice * diffDays;
}

