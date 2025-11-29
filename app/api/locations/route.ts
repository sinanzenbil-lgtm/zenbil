import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Locations GET error:", error);
    return NextResponse.json(
      { error: "Lokasyonlar getirilirken bir hata oluştu" },
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

    const location = await prisma.location.create({
      data,
    });

    return NextResponse.json({ location });
  } catch (error) {
    console.error("Locations POST error:", error);
    return NextResponse.json(
      { error: "Lokasyon oluşturulurken bir hata oluştu" },
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
    const { id, ...updateData } = data;

    const location = await prisma.location.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ location });
  } catch (error) {
    console.error("Locations PUT error:", error);
    return NextResponse.json(
      { error: "Lokasyon güncellenirken bir hata oluştu" },
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
        { error: "Lokasyon ID gereklidir" },
        { status: 400 }
      );
    }

    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Locations DELETE error:", error);
    return NextResponse.json(
      { error: "Lokasyon silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
