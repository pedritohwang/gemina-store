import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories.map(c => c.name));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { category } = await req.json();
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category }
    });
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories.map(c => c.name));
  } catch (error) {
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (name) {
      await prisma.category.delete({
        where: { name }
      });
    }
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories.map(c => c.name));
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
