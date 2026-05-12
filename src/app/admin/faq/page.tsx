"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/admin/admin.module.css";

export default function AdminFAQ() {
  const [faq, setFaq] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faq")
      .then(res => res.json())
      .then(data => {
        setFaq(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faq)
    });
    if (res.ok) alert("FAQ guardada correctamente");
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newFaq = [...faq];
    newFaq[index][field] = value;
    setFaq(newFaq);
  };

  const addItem = () => setFaq([...faq, { title: "", content: "" }]);
  const removeItem = (index: number) => setFaq(faq.filter((_, i) => i !== index));

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Editar FAQ</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleSave} className="btn-primary">Guardar Cambios</button>
          <Link href="/" className="btn-secondary">Volver</Link>
        </div>
      </div>

      <div className={styles.formCard}>
        {faq.map((item, index) => (
          <div key={index} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fcfcfc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <input 
                type="text" value={item.title} 
                onChange={(e) => updateItem(index, 'title', e.target.value)} 
                className={styles.input} style={{ fontWeight: 'bold', width: '80%' }} 
                placeholder="Título de la sección"
              />
              <button onClick={() => removeItem(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Eliminar</button>
            </div>
            <textarea 
              rows={4} value={item.content} 
              onChange={(e) => updateItem(index, 'content', e.target.value)} 
              className={styles.input} 
              placeholder="Contenido de la sección..."
            />
          </div>
        ))}
        <button onClick={addItem} className="btn-secondary" style={{ width: '100%', padding: '1rem', borderStyle: 'dashed' }}>+ Agregar Nueva Sección</button>
      </div>
    </div>
  );
}
