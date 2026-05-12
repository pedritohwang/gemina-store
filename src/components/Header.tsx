"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartModal from "./CartModal";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../app/page.module.css";

export default function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>GÉMINA</div>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Inicio</Link>
        <Link href="/nueva-coleccion" className={styles.navLink}>Nueva Colección</Link>
        <Link href="/productos" className={styles.navLink}>Productos</Link>
        <Link href="/faq" className={styles.navLink}>FAQ</Link>
        {user?.role === 'ADMIN' && (
          <>
            <Link href="/admin/clientes" className={styles.navLink}>👥 Clientes</Link>
            <Link href="/admin/faq" className={styles.navLink}>✏️ Editar FAQ</Link>
          </>
        )}
      </nav>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Hola, {user.name?.split(' ')[0] || 'Usuario'}</span>
            {user.role === 'ADMIN' && (
              <Link href="/admin/productos/nuevo" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Nuevo Producto</Link>
            )}
            <button onClick={logout} className={styles.cartButton} title="Cerrar Sesión" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              🚪
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.navLink} style={{ fontWeight: '600' }}>
            Iniciar Sesión
          </Link>
        )}
        
        <button className={styles.cartButton} onClick={() => setIsCartOpen(true)}>
          🛒
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </button>
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
