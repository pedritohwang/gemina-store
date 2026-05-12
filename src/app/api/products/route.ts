import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, stock, colors, images, sizeTable, isNewCollection } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        category,
        stock: parseInt(stock) || 0,
        colors: typeof colors === 'string' ? colors : JSON.stringify(colors),
        images: typeof images === 'string' ? images : JSON.stringify(images),
        sizeTable: typeof sizeTable === 'string' ? sizeTable : JSON.stringify(sizeTable),
        isNewCollection: isNewCollection || false
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
