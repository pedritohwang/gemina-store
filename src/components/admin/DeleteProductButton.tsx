"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id, name }: { id: string, name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Error al eliminar el producto");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      style={{ 
        color: "var(--color-error)", 
        background: "none", 
        border: "none", 
        padding: 0, 
        cursor: "pointer",
        fontSize: "0.9rem",
        marginLeft: "1rem"
      }}
    >
      {loading ? "..." : "Eliminar"}
    </button>
  );
}
