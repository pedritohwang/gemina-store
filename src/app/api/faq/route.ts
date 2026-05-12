import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const faq = await prisma.fAQ.findMany();
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const faqs = await req.json();
    
    // Simple overwrite strategy for FAQ
    await prisma.fAQ.deleteMany({});
    
    const created = await prisma.fAQ.createMany({
      data: faqs.map((f: any) => ({
        title: f.title,
        content: f.content
      }))
    });
    
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}
