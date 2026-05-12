"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import { getColorName } from "@/lib/colors";

export default function EditarProducto() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    isNewCollection: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<{hex: string, name: string}[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizeTable, setSizeTable] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch("/api/categories")
      ]);

      if (prodRes.ok) {
        const product = await prodRes.json();
        setFormData({
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock.toString(),
          description: product.description || "",
          isNewCollection: product.isNewCollection || false,
        });
        
        if (product.images) {
          try { setImages(JSON.parse(product.images)); } catch (e) { setImages([product.images]); }
        }
        
        if (product.colors) {
          try { 
            const parsedColors = JSON.parse(product.colors);
            // Convert legacy format (string array) to new format (object array)
            const normalizedColors = parsedColors.map((c: any) => {
              if (typeof c === 'string') return { hex: c, name: getColorName(c) };
              return c;
            });
            setColors(normalizedColors);
          } catch (e) { 
            setColors([{ hex: product.colors, name: getColorName(product.colors) }]); 
          }
        } else {
          setColors([{ hex: "#2D2D2D", name: "Gris oscuro" }]);
        }
        
        if (product.sizeTable) {
          try { setSizeTable(JSON.parse(product.sizeTable)); } catch (e) { setSizeTable([]); }
        }
      }

      if (catRes.ok) {
        setCategories(await catRes.json());
      }
    } catch (error) {
      console.error("Error loading product", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    const name = prompt("Nombre de la nueva categoría:");
    if (name) {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: name })
      });
      const res = await fetch("/api/categories");
      if (res.ok) setCategories(await res.json());
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleColorChange = (index: number, hex: string) => {
    const newColors = [...colors];
    newColors[index] = { hex, name: getColorName(hex) };
    setColors(newColors);
  };

  const handleColorNameChange = (index: number, name: string) => {
    const newColors = [...colors];
    newColors[index].name = name;
    setColors(newColors);
  };

  const addColor = () => {
    const hex = "#E3D5CA";
    setColors([...colors, { hex, name: getColorName(hex) }]);
  };

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const deleteCategory = async (name: string) => {
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
    await fetch(`/api/categories?name=${name}`, { method: "DELETE" });
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
  };

  const handleSizeChange = (index: number, field: string, value: string) => {
    const newTable = [...sizeTable];
    newTable[index][field] = value;
    setSizeTable(newTable);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(images),
          colors: JSON.stringify(colors),
          sizeTable: JSON.stringify(sizeTable)
        }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Error al actualizar el producto");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Editar Producto</h1>
        <Link href="/" className="btn-secondary">Volver</Link>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre del Producto</label>
            <input required type="text" className={styles.input} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Imágenes</label>
            <input type="file" multiple accept="image/*" className={styles.input} onChange={handleImageChange} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {images.map((img, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img src={img} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px' }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className={styles.label}>Categoría</label>
              <button type="button" onClick={addCategory} className="btn-secondary" style={{ fontSize: '0.8rem' }}>+ Crear Nueva Categoría</button>
            </div>
            <select required className={styles.input} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="">Selecciona una categoría</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {categories.map((cat, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', background: '#eee', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {cat}
                  <button type="button" onClick={() => deleteCategory(cat)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className={styles.label}>Colores Disponibles</label>
              <button type="button" onClick={addColor} className="btn-secondary" style={{ fontSize: '0.8rem' }}>+ Agregar Color</button>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              {colors.map((color, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f9f9f9', padding: '0.4rem', borderRadius: '6px', border: '1px solid #eee' }}>
                  <input type="color" value={color.hex} onChange={(e) => handleColorChange(index, e.target.value)} style={{ width: '30px', height: '30px', border: 'none', cursor: 'pointer' }} />
                  <input 
                    type="text" 
                    value={color.name} 
                    onChange={(e) => handleColorNameChange(index, e.target.value)} 
                    style={{ fontSize: '0.8rem', color: '#555', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 5px', width: '80px' }}
                    placeholder="Nombre"
                  />
                  <button type="button" onClick={() => removeColor(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Precio ($)</label>
              <input required type="number" className={styles.input} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Stock</label>
              <input required type="number" className={styles.input} value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className={styles.label}>Tabla de Talles</label>
              <button type="button" onClick={() => setSizeTable([...sizeTable, { size: "", busto: "", cintura: "", cadera: "" }])} className="btn-secondary" style={{ fontSize: '0.8rem' }}>+ Agregar Talle</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th>Talle</th><th>Busto</th><th>Cintura</th><th>Cadera</th><th></th>
                </tr>
              </thead>
              <tbody>
                {sizeTable.map((row, index) => (
                  <tr key={index}>
                    <td><input style={{ width: '100%' }} value={row.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} /></td>
                    <td><input style={{ width: '100%' }} value={row.busto} onChange={(e) => handleSizeChange(index, 'busto', e.target.value)} /></td>
                    <td><input style={{ width: '100%' }} value={row.cintura} onChange={(e) => handleSizeChange(index, 'cintura', e.target.value)} /></td>
                    <td><input style={{ width: '100%' }} value={row.cadera} onChange={(e) => handleSizeChange(index, 'cadera', e.target.value)} /></td>
                    <td><button type="button" onClick={() => setSizeTable(sizeTable.filter((_, i) => i !== index))} style={{ color: 'red' }}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea rows={4} className={styles.input} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
            <input type="checkbox" id="isNew" checked={formData.isNewCollection} onChange={(e) => setFormData({...formData, isNewCollection: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            <label htmlFor="isNew" style={{ fontWeight: 'bold', cursor: 'pointer', margin: 0 }}>Marcar como Nueva Colección</label>
          </div>

          <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%', marginTop: '2rem' }}>
            {saving ? "Guardando..." : "Actualizar Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
