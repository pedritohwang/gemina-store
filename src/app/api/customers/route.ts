import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" }
    });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const updated = await prisma.user.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newUser = await prisma.user.create({
      data: {
        ...data,
        role: "CUSTOMER",
        password: data.password || "temp123" // In production use a real hash
      }
    });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
