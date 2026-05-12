"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import { useRouter } from "next/navigation";

export default function BannerManager() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      if (res.ok) setBanners(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result })
        });
        if (res.ok) fetchBanners();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este banner?")) return;
    const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchBanners();
  };

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Gestión de Banners</h1>
        <Link href="/" className="btn-secondary">Volver</Link>
      </div>

      <div className={styles.formCard}>
        <div style={{ backgroundColor: '#e3f2fd', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #bbdefb' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>💡 Recomendaciones de tamaño</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Para que el banner se vea bien en PC y Celular, recomendamos imágenes de <strong>2000 x 800 píxeles</strong> (Relación 2.5:1).
            Asegúrate de que los elementos importantes estén en el centro.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Añadir nuevo banner</label>
          <input type="file" accept="image/*" className={styles.input} onChange={handleUpload} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {banners.map((banner) => (
            <div key={banner.id} style={{ position: 'relative', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={banner.image} style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="Banner" />
              <button 
                onClick={() => handleDelete(banner.id)}
                style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
              >✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
