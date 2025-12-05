import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
          locations: {
            include: {
              location: true,
            },
          },
        },
      });

      if (!vehicle) {
        return NextResponse.json(
          { error: "Araç bulunamadı" },
          { status: 404 }
        );
      }

      return NextResponse.json({ vehicle });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        isActive: true,
      },
      include: {
        locations: {
          include: {
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Vehicles GET error:", error);
    return NextResponse.json(
      { error: "Araçlar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log("[VEHICLE POST] Received data:", JSON.stringify(data, null, 2));
    
    const { locationIds, ...vehicleData } = data;

    // Validate required fields
    if (!vehicleData.brand || !vehicleData.model || !vehicleData.plate) {
      return NextResponse.json(
        { error: "Marka, model ve plaka zorunludur" },
        { status: 400 }
      );
    }

    if (!locationIds || locationIds.length === 0) {
      return NextResponse.json(
        { error: "En az bir lokasyon seçilmelidir" },
        { status: 400 }
      );
    }

    // Check if plate already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plate: vehicleData.plate }
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: `Bu plaka (${vehicleData.plate}) zaten kayıtlı. Lütfen farklı bir plaka girin.` },
        { status: 400 }
      );
    }

    // Convert string numbers to actual numbers
    const vehicleDataProcessed = {
      ...vehicleData,
      year: parseInt(vehicleData.year),
      dailyPrice: parseFloat(vehicleData.dailyPrice),
      deposit: parseFloat(vehicleData.deposit),
    };

    console.log("[VEHICLE POST] Processed data:", vehicleDataProcessed);

    const vehicle = await prisma.vehicle.create({
      data: {
        ...vehicleDataProcessed,
        locations: {
          create: locationIds.map((locationId: string) => ({
            locationId,
          })),
        },
      },
      include: {
        locations: {
          include: {
            location: true,
          },
        },
      },
    });

    console.log("[VEHICLE POST] Vehicle created:", vehicle.id);
    return NextResponse.json({ vehicle });
  } catch (error: any) {
    console.error("Vehicles POST error:", error);
    console.error("Error details:", error.message, error.code);
    return NextResponse.json(
      { error: error.message || "Araç oluşturulurken bir hata oluştu" },
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
    const { id, locationIds, ...vehicleData } = data;

    // Önce mevcut lokasyon ilişkilerini sil
    await prisma.vehicleLocation.deleteMany({
      where: { vehicleId: id },
    });

    // Aracı güncelle ve yeni lokasyon ilişkilerini oluştur
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...vehicleData,
        locations: {
          create: locationIds.map((locationId: string) => ({
            locationId,
          })),
        },
      },
      include: {
        locations: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("Vehicles PUT error:", error);
    return NextResponse.json(
      { error: "Araç güncellenirken bir hata oluştu" },
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
        { error: "Araç ID gereklidir" },
        { status: 400 }
      );
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vehicles DELETE error:", error);
    return NextResponse.json(
      { error: "Araç silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
