"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import detailStyles from "@/app/productos/detail.module.css";
import Link from "next/link";

export default function AddToCartSection({ product, sizeTable, colors }: { product: any, sizeTable: any[], colors: any[] }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(sizeTable.length > 0 ? sizeTable[0].size : "Único");
  const [selectedColor, setSelectedColor] = useState(colors.length > 0 ? colors[0].hex : "#000000");
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    alert("Producto agregado al carrito");
  };

  return (
    <>
      <div className={detailStyles.variants} style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <span className={detailStyles.variantLabel} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Talle:</span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {sizeTable.map((s, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedSize(s.size)}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '6px', 
                border: '1px solid #ddd', 
                background: selectedSize === s.size ? 'black' : 'white', 
                color: selectedSize === s.size ? 'white' : 'black', 
                cursor: 'pointer' 
              }}
            >
              {s.size}
            </button>
          ))}
        </div>
      </div>

      <div className={detailStyles.variants} style={{ marginBottom: '1.5rem' }}>
        <span className={detailStyles.variantLabel} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Color:</span>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          {colors.map((c, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <button 
                onClick={() => setSelectedColor(c.hex)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  border: selectedColor === c.hex ? '3px solid black' : '1px solid #ddd', 
                  background: c.hex, cursor: 'pointer', boxSizing: 'border-box' 
                }}
                title={c.name}
              />
              <span style={{ fontSize: '0.75rem', color: '#555' }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cantidad:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '35px', height: '35px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} style={{ width: '35px', height: '35px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
        </div>
      </div>

      <div className={detailStyles.actions} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
          Agregar al Carrito
        </button>
        <Link href={`https://wa.me/5491140311718?text=Hola! Estoy interesado en el producto: ${product.name}`} target="_blank" className="btn-secondary" style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
          Consultar por WhatsApp
        </Link>
      </div>
    </>
  );
}
