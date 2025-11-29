import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"
import { locationSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const location = await prisma.location.findUnique({
      where: { id: params.id },
    })

    if (!location) {
      return NextResponse.json(
        { error: "Lokasyon bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json({ location })
  } catch (error) {
    console.error("Get location error:", error)
    return NextResponse.json(
      { error: "Lokasyon alınırken bir hata oluştu" },
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
    const validatedData = locationSchema.parse(body)

    const location = await prisma.location.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({ location })
  } catch (error) {
    console.error("Update location error:", error)
    return NextResponse.json(
      { error: "Lokasyon güncellenirken bir hata oluştu" },
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

    await prisma.location.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete location error:", error)
    return NextResponse.json(
      { error: "Lokasyon silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

