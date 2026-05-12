import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const config = await prisma.brandConfig.findUnique({
      where: { id: "singleton" }
    });
    return NextResponse.json(config || {});
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = await prisma.brandConfig.upsert({
      where: { id: "singleton" },
      update: body,
      create: { ...body, id: "singleton" }
    });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
