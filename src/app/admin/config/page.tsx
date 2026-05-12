"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import { useRouter } from "next/navigation";

export default function AdminConfig() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: "",
    address: "",
    phone: "",
    instagram: "",
    rating: "",
    reviewsCount: "",
    hours: ""
  });

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setFormData(data);
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert("Configuración guardada correctamente");
      router.push("/");
      router.refresh();
    }
  };

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Editar Configuración de Tienda</h1>
        <Link href="/" className="btn-secondary">Volver</Link>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción de la Tienda (Footer)</label>
            <textarea required rows={3} className={styles.input} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Ej: Tienda mayorista de ropas en Buenos Aires. Talles reales para mujeres reales." />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Dirección (para Google Maps)</label>
            <input required type="text" className={styles.input} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Teléfono (para WhatsApp, Ej: 011 4031-1718)</label>
            <input required type="text" className={styles.input} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Link de Instagram</label>
            <input required type="text" className={styles.input} value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Horario de Atención</label>
            <input required type="text" className={styles.input} value={formData.hours} onChange={(e) => setFormData({...formData, hours: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Puntuación (Ej: 5.0)</label>
              <input required type="text" className={styles.input} value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Cantidad de Reseñas (Ej: 100+)</label>
              <input required type="text" className={styles.input} value={formData.reviewsCount} onChange={(e) => setFormData({...formData, reviewsCount: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}
