export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const products = await db.product.findMany()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await db.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    )
  }
}