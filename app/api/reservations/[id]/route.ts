import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated(request)
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        vehicle: true,
        location: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: "Rezervasyon bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("Get reservation error:", error)
    return NextResponse.json(
      { error: "Rezervasyon alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated(request)
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const body = await request.json()
    const { status, notes } = body

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        vehicle: true,
        location: true,
      },
    })

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("Update reservation error:", error)
    return NextResponse.json(
      { error: "Rezervasyon güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated(request)
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    await prisma.reservation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete reservation error:", error)
    return NextResponse.json(
      { error: "Rezervasyon silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

