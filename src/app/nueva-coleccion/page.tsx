import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import { getProducts, readDb } from "@/lib/db";
import styles from "@/app/page.module.css";
import Link from "next/link";

export default async function NuevaColeccion() {
  const dbProducts = await getProducts();
  const newCollectionProducts = dbProducts.filter((p: any) => p.isNewCollection);
  const db = readDb();
  const brandInfo = db.brandInfo || {
    address: "Helguera 772, C1406 Cdad. Autónoma de Buenos Aires",
    phone: "011 4031-1718",
    instagram: "https://www.instagram.com/gemina_bsas/",
    hours: "Lunes a Viernes 08:00 a 16:30"
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brandInfo.address)}`;
  const cleanPhone = brandInfo.phone.replace(/\D/g, '');
  const waLink = `https://wa.me/549${cleanPhone}`;

  return (
    <main>
      <Header />
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem', minHeight: '80vh' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>✨ Nueva Colección ✨</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}>Descubre los últimos ingresos de temporada.</p>
        
        {newCollectionProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Por el momento no hay nuevos ingresos destacados. ¡Vuelve pronto!</p>
        ) : (
          <ProductList initialProducts={newCollectionProducts} />
        )}
      </div>

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
      </footer>
    </main>
  );
}
