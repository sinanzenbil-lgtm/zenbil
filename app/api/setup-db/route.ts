import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';

export async function GET() {
  try {
    const results = {
      admin: null as any,
      locations: [] as any[]
    };

    // Check and create admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: "admin@carbreeze.com" }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await prisma.admin.create({
        data: {
          email: "admin@carbreeze.com",
          password: hashedPassword,
          firstName: "Admin",
          lastName: "User",
        },
      });
      results.admin = { email: admin.email, created: true };
    } else {
      results.admin = { email: existingAdmin.email, created: false };
    }

    // Check and create locations
    const locationCount = await prisma.location.count();
    
    if (locationCount === 0) {
      const locations = [
        {
          name: "Sabiha Gökçen Havalimanı",
          address: "Sabiha Gökçen Havalimanı, Pendik, İstanbul",
          phone: "0530 131 32 58",
        },
        {
          name: "İstanbul Havalimanı",
          address: "İstanbul Havalimanı, Arnavutköy, İstanbul",
          phone: "0530 131 32 58",
        },
        {
          name: "Şişli Merkez",
          address: "Fulya, Mehmetçik Cd. No:48/D, 34394 Şişli/İstanbul",
          phone: "0530 131 32 58",
        },
      ];

      for (const loc of locations) {
        const created = await prisma.location.create({ data: loc });
        results.locations.push({ name: created.name, created: true });
      }
    } else {
      const existingLocs = await prisma.location.findMany();
      results.locations = existingLocs.map(l => ({ name: l.name, created: false }));
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database setup completed",
      results
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

