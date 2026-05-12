import Link from "next/link";
import styles from "../page.module.css";
import ProductList from "@/components/ProductList";
import { getProducts } from "@/lib/db";

import Header from "@/components/Header";

export default async function ProductosPage() {
  const dbProducts = await getProducts();

  const mockProducts = [
    { id: "1", name: "Top Torzado", price: 7700, category: "Tops", images: JSON.stringify(["https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&q=80&w=800"]) },
    { id: "2", name: "Manga Larga con Frunce", price: 12000, category: "Remeras", images: JSON.stringify(["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800"]) },
    { id: "3", name: "Pollera Lara", price: 15500, category: "Polleras", images: JSON.stringify(["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800"]) },
    { id: "4", name: "Body Cuello Cuadrado", price: 9300, category: "Bodys", images: JSON.stringify(["https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=800"]) },
  ];

  const initialProducts = dbProducts.length > 0 ? dbProducts : mockProducts;

  return (
    <main>
      <Header />

      <section className={`container ${styles.section}`}>
        <h1 className={styles.sectionTitle}>Nuestra Colección</h1>
        <ProductList initialProducts={initialProducts} />
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerTitle}>GÉMINA</h3>
              <p className={styles.footerInfo}>Tienda mayorista de ropas en Buenos Aires. Talles reales para mujeres reales.</p>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Contacto</h4>
              <p className={styles.footerInfo}>Helguera 772, C1406 Cdad. Autónoma de Buenos Aires</p>
              <p className={styles.footerInfo}>Tel: 011 4031-1718</p>
              <Link href="https://www.instagram.com/gemina_bsas/" target="_blank" className={styles.footerLink}>Instagram @gemina_bsas</Link>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Horario</h4>
              <p className={styles.footerInfo}>Lunes a Viernes</p>
              <p className={styles.footerInfo}>08:00 a 16:30</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

