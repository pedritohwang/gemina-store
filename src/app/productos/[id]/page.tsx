import { getProductById } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "../../page.module.css";
import detailStyles from "../detail.module.css";
import Header from "@/components/Header";
import AdminOnly from "@/components/AdminOnly";
import AddToCartSection from "@/components/AddToCartSection";
import { getColorName } from "@/lib/colors";

const MOCK_PRODUCTS: any[] = [];

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = await getProductById(id);

  if (!product) {
    product = MOCK_PRODUCTS.find(p => p.id === id);
  }

  if (!product) {
    notFound();
  }

  const parseImages = (imgData: any) => {
    if (!imgData) return ["https://images.unsplash.com/photo-1618333448491-188381b2cc1e?auto=format&fit=crop&q=80&w=800"];
    if (typeof imgData === 'string' && imgData.startsWith('[')) {
      try {
        return JSON.parse(imgData);
      } catch (e) {
        return [imgData];
      }
    }
    return Array.isArray(imgData) ? imgData : [imgData];
  };

  const parseColors = (colorData: any) => {
    if (!colorData) return [];
    try {
      const parsed = typeof colorData === 'string' ? JSON.parse(colorData) : colorData;
      return (Array.isArray(parsed) ? parsed : [parsed]).map((c: any) => {
        if (typeof c === 'string') return { hex: c, name: getColorName(c) };
        return c;
      });
    } catch (e) {
      return [];
    }
  };

  const parseSizeTable = (tableData: any) => {
    if (!tableData) return [
      { size: "L (3)", busto: "95-100", cintura: "80-85", cadera: "105-110" },
      { size: "XL (4)", busto: "100-105", cintura: "85-90", cadera: "110-115" },
      { size: "XXL (5)", busto: "105-110", cintura: "90-95", cadera: "115-120" },
    ];
    if (typeof tableData === 'string' && tableData.startsWith('[')) {
      try {
        return JSON.parse(tableData);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(tableData) ? tableData : [];
  };

  const images = parseImages(product.image || product.images);
  const colors = parseColors(product.colors);
  const sizeTable = parseSizeTable(product.sizeTable);

  return (
    <main>
      <Header />

      <div className="container">
        <div className={detailStyles.detailContainer}>
          <div className={detailStyles.imageGallery}>
            <img 
              src={images[0]} 
              alt={product.name} 
              className={detailStyles.mainImage}
            />
          </div>

          <div className={detailStyles.productDetails}>
            <span className={detailStyles.category}>{product.category}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className={detailStyles.title}>{product.name}</h1>
              <AdminOnly>
                <Link href={`/admin/productos/editar/${product.id}`} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  [⚙️ Editar]
                </Link>
              </AdminOnly>
            </div>
            <p className={detailStyles.price}>${product.price}</p>
            
            <p className={detailStyles.description}>
              {product.description || "Sin descripción disponible."}
            </p>

            <div className={detailStyles.sizeGuide}>
              <span className={detailStyles.variantLabel}>Tabla de Talles (Talles Reales):</span>
              <table className={detailStyles.sizeTable}>
                <thead>
                  <tr>
                    <th>Talle</th>
                    <th>Busto (cm)</th>
                    <th>Cintura (cm)</th>
                    <th>Cadera (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeTable.map((row: any, index: number) => (
                    <tr key={index}>
                      <td>{row.size}</td>
                      <td>{row.busto}</td>
                      <td>{row.cintura}</td>
                      <td>{row.cadera}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AddToCartSection product={product} sizeTable={sizeTable} colors={colors} />
          </div>
        </div>
      </div>

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
