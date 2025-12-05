import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: "admin@carbreeze.com" }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: "Admin already exists",
        admin: { email: existingAdmin.email }
      });
    }

    // Create admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prisma.admin.create({
      data: {
        email: "admin@carbreeze.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin created successfully",
      admin: { email: admin.email }
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

