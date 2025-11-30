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
    console.log("Gelen veri:", JSON.stringify(data, null, 2));

    // Admin kontrolü - adminden gelen isteklerde müsaitlik kontrolü yapma
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";

    // Eğer araç seçilmişse ve admin değilse müsaitlik kontrolü yap
    if (data.vehicleId && !isAdmin) {
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
    }

    // Rezervasyon verilerini hazırla
    const reservationData: any = {
      status: data.status || "PENDING",
      totalPrice: data.totalPrice || 0,
      notes: data.notes || "",
      deposit: data.deposit || 0,
    };

    // Opsiyonel alanları ekle (varsa)
    if (data.vehicleId) reservationData.vehicleId = data.vehicleId;
    if (data.locationId) reservationData.locationId = data.locationId;
    if (data.pickupDate) reservationData.pickupDate = new Date(data.pickupDate);
    if (data.returnDate) reservationData.returnDate = new Date(data.returnDate);
    if (data.pickupTime) reservationData.pickupTime = data.pickupTime;
    if (data.returnTime) reservationData.returnTime = data.returnTime;
    if (data.firstName) reservationData.firstName = data.firstName;
    if (data.lastName) reservationData.lastName = data.lastName;
    if (data.email) reservationData.email = data.email;
    if (data.phone) reservationData.phone = data.phone;
    if (data.idNumber) reservationData.idNumber = data.idNumber;
    if (data.tcNo) reservationData.idNumber = data.tcNo; // tcNo'yu idNumber olarak kaydet
    if (data.licenseNo) reservationData.licenseNo = data.licenseNo;

    console.log("Prisma'ya gönderilecek veri:", JSON.stringify(reservationData, null, 2));

    const reservation = await prisma.reservation.create({
      data: reservationData,
    });

    console.log("Oluşturulan rezervasyon:", reservation);

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Reservations POST error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Rezervasyon oluşturulurken bir hata oluştu: " + (error as Error).message },
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
