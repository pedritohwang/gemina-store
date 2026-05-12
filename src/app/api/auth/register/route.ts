import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, province, address } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        phone,
        province,
        address,
        role: "CUSTOMER"
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error detallado en Registro:", error);
    return NextResponse.json(
      { error: `Error en el servidor: ${error.message || "Error desconocido"}` },
      { status: 500 }
    );
  }
}
