import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email adresi gereklidir" },
        { status: 400 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
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
    console.error("Get reservations by email error:", error);
    return NextResponse.json(
      { error: "Rezervasyonlar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}


