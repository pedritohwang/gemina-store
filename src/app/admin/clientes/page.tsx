"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminClientes() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) setCustomers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (customer: any) => {
    setEditingId(customer.id);
    setEditData({
      province: customer.province || "",
      transport: customer.transport || "",
      email: customer.email || "",
      phone: customer.phone || "",
      name: customer.name || "",
      address: customer.address || ""
    });
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData })
      });
      if (res.ok) {
        setEditingId(null);
        fetchCustomers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Listado de Clientes</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" className="btn-secondary">Volver</Link>
        </div>
      </div>

      <div className={styles.formCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Logística (Provincia / Transporte)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((user: any) => (
              <tr key={user.id}>
                <td>
                  {editingId === user.id ? (
                    <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className={styles.input} style={{ marginBottom: '5px' }} />
                  ) : (
                    <strong>{user.name}</strong>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {user.id}</div>
                </td>
                <td>
                  {editingId === user.id ? (
                    <>
                      <input type="text" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className={styles.input} style={{ marginBottom: '5px' }} />
                      <input type="text" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} className={styles.input} />
                    </>
                  ) : (
                    <>
                      <div>{user.email}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.phone}</div>
                    </>
                  )}
                </td>
                <td>
                  {editingId === user.id ? (
                    <>
                      <input type="text" placeholder="Provincia" value={editData.province} onChange={(e) => setEditData({...editData, province: e.target.value})} className={styles.input} style={{ marginBottom: '5px' }} />
                      <input type="text" placeholder="Transporte" value={editData.transport} onChange={(e) => setEditData({...editData, transport: e.target.value})} className={styles.input} />
                    </>
                  ) : (
                    <>
                      <div>{user.province || "Sin provincia"}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.transport || "Sin transporte asignado"}</div>
                    </>
                  )}
                </td>
                <td>
                  {editingId === user.id ? (
                    <button onClick={() => handleSave(user.id)} className="btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Guardar</button>
                  ) : (
                    <button onClick={() => startEdit(user)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
