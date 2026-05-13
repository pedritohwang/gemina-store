export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import Header from "@/components/Header"
import { db } from "@/lib/db"
import ProductCard from "@/components/ProductCard"
import styles from "../page.module.css"

export default async function NuevaColeccionPage() {
  const products = await db.product.findMany({
    where: {
      isNewCollection: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const parsedProducts = products.map(product => ({
    ...product,
    images: JSON.parse(product.images || '[]'),
    colors: JSON.parse(product.colors || '[]'),
    sizeTable: JSON.parse(product.sizeTable || '[]'),
  }))

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Nueva Colección</h1>

          {parsedProducts.length === 0 ? (
            <p>No hay productos en la nueva colección.</p>
          ) : (
            <div className={styles.productGrid}>
              {parsedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}