import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: {
        locations: {
          include: {
            location: true,
          },
        },
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error("Get vehicle error:", error)
    return NextResponse.json(
      { error: "Araç alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticated = await isAuthenticated(request)
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { locationIds, ...vehicleData } = body

    // Önce mevcut lokasyon ilişkilerini sil
    await prisma.vehicleLocation.deleteMany({
      where: { vehicleId: params.id },
    })

    // Aracı güncelle ve yeni lokasyonları ekle
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
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
    })

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error("Update vehicle error:", error)
    return NextResponse.json(
      { error: "Araç güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticated = await isAuthenticated(request)
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.vehicle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete vehicle error:", error)
    return NextResponse.json(
      { error: "Araç silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

