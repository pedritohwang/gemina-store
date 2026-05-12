import Header from "@/components/Header";
import { readDb } from "@/lib/db";
import styles from "../page.module.css";
import Link from "next/link";

export default function FAQPage() {
  const db = readDb();
  const faq = db.faq || [];

  return (
    <main>
      <Header />
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem', maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Preguntas Frecuentes</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {faq.map((item: any, idx: number) => (
            <div key={idx} style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--color-text)', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem', display: 'inline-block' }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#444', whiteSpace: 'pre-wrap' }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center', background: '#e3f2fd', padding: '2rem', borderRadius: '12px' }}>
          <p style={{ fontWeight: '600', marginBottom: '1rem' }}>¿Aún tienes dudas?</p>
          <Link href="https://wa.me/5491140311718" target="_blank" className="btn-primary" style={{ textDecoration: 'none' }}>
            Consultar por WhatsApp
          </Link>
        </div>
      </div>
    </main>
  );
}
