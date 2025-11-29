import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { checkVehicleAvailability } from "@/lib/availability";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          vehicle: true,
          location: true,
        },
      });

      if (!reservation) {
        return NextResponse.json(
          { error: "Rezervasyon bulunamadı" },
          { status: 404 }
        );
      }

      return NextResponse.json({ reservation });
    }

    const reservations = await prisma.reservation.findMany({
      include: {
        vehicle: true,
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Reservations GET error:", error);
    return NextResponse.json(
      { error: "Rezervasyonlar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Müsaitlik kontrolü
    const isAvailable = await checkVehicleAvailability(data.vehicleId, {
      locationId: data.locationId,
      pickupDate: new Date(data.pickupDate),
      returnDate: new Date(data.returnDate),
      pickupTime: data.pickupTime,
      returnTime: data.returnTime,
    });

    if (!isAvailable) {
      return NextResponse.json(
        { error: "Bu araç seçtiğiniz tarihlerde müsait değil" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        vehicleId: data.vehicleId,
        locationId: data.locationId,
        pickupDate: new Date(data.pickupDate),
        returnDate: new Date(data.returnDate),
        pickupTime: data.pickupTime,
        returnTime: data.returnTime,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        idNumber: data.idNumber,
        totalPrice: data.totalPrice,
        deposit: data.deposit,
        notes: data.notes || "",
        status: "PENDING",
      },
      include: {
        vehicle: true,
        location: true,
      },
    });

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Reservations POST error:", error);
    return NextResponse.json(
      { error: "Rezervasyon oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, status } = data;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        vehicle: true,
        location: true,
      },
    });

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Reservations PUT error:", error);
    return NextResponse.json(
      { error: "Rezervasyon güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Rezervasyon ID gereklidir" },
        { status: 400 }
      );
    }

    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservations DELETE error:", error);
    return NextResponse.json(
      { error: "Rezervasyon silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
