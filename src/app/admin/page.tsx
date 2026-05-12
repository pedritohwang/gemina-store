import Link from "next/link";
import styles from "./admin.module.css";
import { PrismaClient } from "@prisma/client";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

const prisma = new PrismaClient();

async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error loading products", error);
    return [];
  }
}

export default async function AdminDashboard() {
  const products = await getProducts();

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Panel de Control</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/clientes" className="btn-secondary">
            👥 Clientes
          </Link>
          <Link href="/" className="btn-secondary">
            Ver Tienda
          </Link>
          <Link href="/admin/productos/nuevo" className="btn-primary">
            + Nuevo Producto
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p>No hay productos registrados todavía.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td style={{ display: 'flex', alignItems: 'center' }}>
                  <Link href={`/admin/productos/editar/${product.id}`} style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                    Editar
                  </Link>
                  <DeleteProductButton id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
