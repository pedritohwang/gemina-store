export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import Header from "@/components/Header"
import { db } from "@/lib/db"
import styles from "../page.module.css"
import Link from "next/link"

export default async function FAQPage() {
  const faqs = await db.fAQ.findMany({
    orderBy: { id: 'asc' }
  })

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Preguntas Frecuentes</h1>

          {faqs.length === 0 ? (
            <p>No hay preguntas frecuentes cargadas.</p>
          ) : (
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <div key={faq.id} className={styles.faqItem}>
                  <h3>{faq.title}</h3>
                  <p>{faq.content}</p>
                </div>
              ))}
            </div>
          )}

          <Link href="/" className={styles.backLink}>
            Volver al inicio
          </Link>
        </div>
      </main>
    </>
  )
}