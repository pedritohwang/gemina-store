import Link from "next/link";
import styles from "./page.module.css";
import ProductList from "@/components/ProductList";
import Header from "@/components/Header";
import { getProducts, readDb } from "@/lib/db";

export default async function Home() {
  const dbProducts = await getProducts();
  const db = readDb();
  const banners = db.banners || [];
  const heroImage = banners.length > 0 ? banners[0].image : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000";

  const brandInfo = db.brandInfo || {
    address: "Helguera 772, C1406 Cdad. Autónoma de Buenos Aires",
    phone: "011 4031-1718",
    instagram: "https://www.instagram.com/gemina_bsas/",
    rating: "5.0",
    reviewsCount: "100+",
    hours: "Lunes a Viernes 08:00 a 16:30"
  };

  const initialProducts = dbProducts.length > 0 ? dbProducts : [];
  const newCollectionProducts = initialProducts.filter(p => p.isNewCollection);

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brandInfo.address)}`;
  const cleanPhone = brandInfo.phone.replace(/\D/g, '');
  const waLink = `https://wa.me/549${cleanPhone}`;

  return (
    <main>
      <Header />

      <section className={styles.hero} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div className={`animate-fade-in ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>Celebra tu cuerpo</h1>
          <p className={styles.heroSubtitle}>
            Talles reales plus size diseñados pensando en vos. Ropa moderna, cómoda y con estilo.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/productos" className="btn-primary">
              Ver Colección
            </Link>
          </div>
        </div>
        
        {/* Tuerca de edición para Admin */}
        <Link href="/admin/banners" style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', textDecoration: 'none', fontSize: '1.4rem', zIndex: 10 }}>
          ⚙️
        </Link>
      </section>

      {newCollectionProducts.length > 0 && (
        <section className={`container ${styles.section}`}>
          <h2 className={styles.sectionTitle}>✨ Nueva Colección ✨</h2>
          <ProductList initialProducts={newCollectionProducts} />
        </section>
      )}

      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Nuestra Colección</h2>
        <ProductList initialProducts={initialProducts} />
      </section>

      <section className={styles.statsSection}>
        <div className={`container ${styles.statsGrid}`}>
          <div>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>+5000</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Clientas Felices</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>100%</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Calidad Garantizada</p>
          </div>
          <div>
            <h2 className={styles.sectionTitle}>Opiniones en Google</h2>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
              {brandInfo.rating} ⭐⭐⭐⭐⭐
            </div>
            <p style={{ color: 'var(--color-text-muted)' }}>Basado en {brandInfo.reviewsCount} reseñas</p>
            <div style={{ marginTop: '1rem' }}>
              <Link href="https://g.page/r/CWjO3g5K2C0NEAE" target="_blank" className="btn-secondary" style={{ fontSize: '0.9rem' }}>Ver Reseñas</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer} style={{ position: 'relative' }}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerTitle}>GÉMINA</h3>
              <p className={styles.footerInfo}>{brandInfo.description || "Tienda mayorista de ropas en Buenos Aires. Talles reales para mujeres reales."}</p>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Contacto</h4>
              <Link href={mapLink} target="_blank" className={styles.footerLink} style={{ display: 'block', marginBottom: '0.5rem' }}>{brandInfo.address}</Link>
              <Link href={waLink} target="_blank" className={styles.footerLink} style={{ display: 'block', marginBottom: '0.5rem' }}>Tel: {brandInfo.phone}</Link>
              <Link href="/faq" className={styles.footerLink} style={{ display: 'block', marginBottom: '0.5rem' }}>Preguntas Frecuentes</Link>
              <Link href={brandInfo.instagram} target="_blank" className={styles.footerLink} style={{ display: 'block', marginBottom: '0.5rem' }}>Instagram @gemina_bsas</Link>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Horario</h4>
              <p className={styles.footerInfo}>{brandInfo.hours}</p>
            </div>
          </div>
          <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid #444', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
            &copy; {new Date().getFullYear()} Gémina bsas. Todos los derechos reservados.
          </div>
        </div>
        
        {/* Tuerca de edición del footer */}
        <Link href="/admin/config" style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1.4rem', zIndex: 10 }}>
          ⚙️
        </Link>
      </footer>
    </main>
  );
}
