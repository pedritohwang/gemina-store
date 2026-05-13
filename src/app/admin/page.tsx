export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { db } from "@/lib/db"
import AdminClient from "./AdminClient"

export default async function AdminPage() {
  const [products, faqs, banners, brandConfig] = await Promise.all([
    db.product.findMany({ orderBy: { createdAt: 'desc' } }),
    db.fAQ.findMany({ orderBy: { id: 'asc' } }),
    db.banner.findMany({ orderBy: { id: 'asc' } }),
    db.brandConfig.findUnique({ where: { id: 'singleton' } })
  ])

  const parsedProducts = products.map(product => ({
    ...product,
    images: JSON.parse(product.images || '[]'),
    colors: JSON.parse(product.colors || '[]'),
    sizeTable: JSON.parse(product.sizeTable || '[]'),
  }))

  return (
    <AdminClient
      initialProducts={parsedProducts}
      initialFaqs={faqs}
      initialBanners={banners}
      initialBrandConfig={brandConfig}
    />
  )
}