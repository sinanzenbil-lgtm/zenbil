import { NextRequest, NextResponse } from "next/server";
import { getAvailableVehicles } from "@/lib/availability";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get("locationId");
    const pickupDate = searchParams.get("pickupDate");
    const returnDate = searchParams.get("returnDate");
    const pickupTime = searchParams.get("pickupTime");
    const returnTime = searchParams.get("returnTime");

    if (!locationId || !pickupDate || !returnDate || !pickupTime || !returnTime) {
      return NextResponse.json(
        { error: "Tüm parametreler gereklidir" },
        { status: 400 }
      );
    }

    const vehicles = await getAvailableVehicles({
      locationId,
      pickupDate: new Date(pickupDate),
      returnDate: new Date(returnDate),
      pickupTime,
      returnTime,
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Available vehicles error:", error);
    return NextResponse.json(
      { error: "Araçlar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

