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
    const { locationIds, ...vehicleData } = data;

    const vehicle = await prisma.vehicle.create({
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
    console.error("Vehicles POST error:", error);
    return NextResponse.json(
      { error: "Araç oluşturulurken bir hata oluştu" },
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
