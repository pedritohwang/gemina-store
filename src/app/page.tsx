export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { db } from '@/lib/db'

export default async function Home() {
  const products = await db.product.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </main>
  )
}