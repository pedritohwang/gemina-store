"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../app/page.module.css";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getColorName } from "@/lib/colors";

export default function ProductList({ initialProducts }: { initialProducts: any[] }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Estado para el producto que se está seleccionando
  const [selectingProduct, setSelectingProduct] = useState<any | null>(null);
  const [selection, setSelection] = useState({ size: "", color: "", quantity: 1 });

  useEffect(() => {
    const uniqueCats = ["Todos", ...new Set(initialProducts.map(p => p.category))];
    setCategories(uniqueCats);
  }, [initialProducts]);

  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const parseImages = (imgData: any) => {
    if (!imgData) return ["https://images.unsplash.com/photo-1618333448491-188381b2cc1e?auto=format&fit=crop&q=80&w=800"];
    if (typeof imgData === 'string' && imgData.startsWith('[')) {
      try { return JSON.parse(imgData); } catch (e) { return [imgData]; }
    }
    return Array.isArray(imgData) ? imgData : [imgData];
  };

  const parseColors = (colorData: any) => {
    if (!colorData) return [];
    try {
      const parsed = typeof colorData === 'string' ? JSON.parse(colorData) : colorData;
      return parsed.map((c: any) => {
        if (typeof c === 'string') return { hex: c, name: getColorName(c) };
        return c;
      });
    } catch (e) {
      return [];
    }
  };

  const handleOpenSelection = (product: any) => {
    let defaultSize = "Único";
    let defaultColor = "#000000";
    try {
      const sizes = JSON.parse(product.sizeTable);
      if (sizes.length > 0) defaultSize = sizes[0].size;
      const colors = parseColors(product.colors);
      if (colors.length > 0) defaultColor = colors[0].hex;
    } catch(e){}
    
    setSelection({ size: defaultSize, color: defaultColor, quantity: 1 });
    setSelectingProduct(product);
  };

  const handleConfirmAdd = () => {
    if (selectingProduct) {
      addToCart(selectingProduct, selection.quantity, selection.size, selection.color);
      setSelectingProduct(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0', position: 'relative' }}>
      {/* Botón Colapsar */}
      <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ position: 'fixed', left: isCollapsed ? '10px' : '230px', top: '90px', zIndex: 50, background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', transition: 'left 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {isCollapsed ? '▶' : '◀'}
      </button>

      {/* Sidebar */}
      <aside style={{ width: isCollapsed ? '0' : '240px', position: 'fixed', top: '80px', left: isCollapsed ? '-240px' : '0', height: 'calc(100vh - 80px)', overflowY: 'auto', padding: isCollapsed ? '0' : '2rem 1.5rem', background: '#fff', borderRight: '1px solid #eee', zIndex: 40, transition: 'all 0.3s ease', visibility: isCollapsed ? 'hidden' : 'visible' }}>
        <div style={{ position: 'relative', marginBottom: '2.5rem', opacity: isCollapsed ? 0 : 1 }}>
          <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }} />
          <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        </div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '0.5px' }}>CATEGORÍAS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ textAlign: 'left', padding: '0.7rem 1rem', borderRadius: '6px', border: 'none', background: selectedCategory === cat ? 'var(--color-text)' : 'transparent', color: selectedCategory === cat ? 'white' : 'var(--color-text)', cursor: 'pointer', fontWeight: selectedCategory === cat ? '600' : '400', fontSize: '0.95rem', transition: 'all 0.2s ease' }}>
              {cat}
            </button>
          ))}
        </div>
      </aside>

      {/* Grid de Productos */}
      <div style={{ flex: 1, marginLeft: isCollapsed ? '40px' : '240px', padding: '0 2rem', transition: 'margin-left 0.3s ease' }}>
        <div className={styles.productGrid}>
          {filteredProducts.map((product: any) => {
            const images = parseImages(product.images || product.image);
            return (
              <div key={product.id} style={{ position: 'relative' }} className="product-card-wrapper">
                <div className={styles.productCard}>
                  <Link href={`/productos/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.imageContainer}>
                      <img src={images[0]} alt={product.name} className={styles.productImage} />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>${product.price}</p>
                    </div>
                  </Link>
                  <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/productos/${product.id}`} className="btn-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', textDecoration: 'none' }}>Ver</Link>
                    <button onClick={() => handleOpenSelection(product)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>🛒+</button>
                  </div>
                </div>
                {user?.role === 'ADMIN' && (
                  <Link href={`/admin/productos/editar/${product.id}`} style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2, textDecoration: 'none', fontSize: '1.2rem' }}>
                    ⚙️
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selector de Talle y Color (Modal rápido) */}
      {selectingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>{selectingProduct.name}</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Seleccionar Talle:</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {JSON.parse(selectingProduct.sizeTable).map((s: any, i: number) => (
                  <button key={i} onClick={() => setSelection({...selection, size: s.size})} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ddd', background: selection.size === s.size ? 'black' : 'white', color: selection.size === s.size ? 'white' : 'black', cursor: 'pointer' }}>
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Seleccionar Color:</label>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                {parseColors(selectingProduct.colors).map((c: any, i: number) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <button onClick={() => setSelection({...selection, color: c.hex})} style={{ width: '35px', height: '35px', borderRadius: '50%', border: selection.color === c.hex ? '3px solid black' : '1px solid #ddd', background: c.hex, cursor: 'pointer', boxSizing: 'border-box' }} title={c.name} />
                    <span style={{ fontSize: '0.7rem', color: '#666', textAlign: 'center', maxWidth: '50px' }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cantidad:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button type="button" onClick={() => setSelection({...selection, quantity: Math.max(1, selection.quantity - 1)})} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>-</button>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{selection.quantity}</span>
                <button type="button" onClick={() => setSelection({...selection, quantity: selection.quantity + 1})} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setSelectingProduct(null)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
              <button onClick={handleConfirmAdd} className="btn-primary" style={{ flex: 1 }}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
