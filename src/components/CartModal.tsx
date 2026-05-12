"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const MIN_PURCHASE = 70000;

import { getColorName } from '@/lib/colors';

export default function CartModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { cart, removeFromCart, totalPrice, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (!user) {
      alert("Por favor, inicia sesión para finalizar la compra.");
      return;
    }

    if (totalPrice < MIN_PURCHASE) {
      alert(`La compra mínima online es de $${MIN_PURCHASE.toLocaleString()}. Por favor, agrega más productos.`);
      return;
    }

    const phoneNumber = "5491140311718"; // Teléfono de Gémina
    let message = `¡Hola Gémina! Soy ${user.name}, quiero realizar el siguiente pedido:\n\n`;
    
    cart.forEach(item => {
      const colorText = item.colorName || 'N/A';
      message += `- ${item.name} x${item.quantity} (Talle: ${item.size || 'N/A'}, Color: ${colorText}) - $${item.price * item.quantity}\n`;
    });
    
    message += `\n*Total: $${totalPrice}*\n\n`;
    message += `¿Tienen stock disponible para coordinar el pago y retiro/envío?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    clearCart();
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '400px', background: 'white', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Tu Carrito</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>El carrito está vacío.</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <img src={item.image} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt={item.name} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.2rem 0' }}>{item.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>Talle: {item.size} | Color: <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: item.color, borderRadius: '50%', marginRight: '4px' }}></span> {item.colorName}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#f5f5f5', padding: '2px 8px', borderRadius: '6px' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size!, item.color!, -1)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                      >
                        {item.quantity === 1 ? '🗑️' : '-'}
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size!, item.color!, 1)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: '2px solid #eee', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              <span>Total:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>

            {totalPrice < MIN_PURCHASE && (
              <div style={{ background: '#fff3cd', color: '#856404', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid #ffeeba' }}>
                ⚠️ Falta <strong>${(MIN_PURCHASE - totalPrice).toLocaleString()}</strong> para llegar al mínimo de compra ($70.000).
              </div>
            )}

            <button 
              onClick={handleWhatsAppCheckout}
              disabled={totalPrice < MIN_PURCHASE}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                backgroundColor: totalPrice < MIN_PURCHASE ? '#ccc' : '#25D366', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                cursor: totalPrice < MIN_PURCHASE ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>Finalizar por WhatsApp</span>
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/faq" onClick={onClose} style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'underline' }}>Ver políticas de compra (FAQ)</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
