import { NextRequest, NextResponse } from "next/server"
import { getAvailableVehicles } from "@/lib/availability"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locationId = searchParams.get("locationId")
    const pickupDate = searchParams.get("pickupDate")
    const returnDate = searchParams.get("returnDate")

    if (!locationId || !pickupDate || !returnDate) {
      return NextResponse.json(
        { error: "Lokasyon, alış tarihi ve dönüş tarihi gereklidir" },
        { status: 400 }
      )
    }

    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)

    if (pickup >= returnD) {
      return NextResponse.json(
        { error: "Dönüş tarihi alış tarihinden sonra olmalıdır" },
        { status: 400 }
      )
    }

    if (pickup < new Date()) {
      return NextResponse.json(
        { error: "Geçmiş tarih seçilemez" },
        { status: 400 }
      )
    }
const vehicles = await getAvailableVehicles({
  locationId,
  pickup,
  returnD,
})
    })

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json(
      { error: "Müsaitlik kontrolü sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}

