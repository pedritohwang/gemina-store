"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Google Verify, 2: Details
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "", // From Google
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const simulateGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setFormData({ ...formData, email: "cliente@google.com" });
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, password: "google-auth-user" }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        router.push("/");
      } else {
        setError(data.error || "Error al completar el registro");
      }
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ minHeight: '90vh', padding: '2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{step === 1 ? "Registro" : "Último paso"}</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          {step === 1 ? "Inicia sesión con Google para continuar" : "Completa tus datos de contacto"}
        </p>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        {step === 1 ? (
          <button 
            onClick={simulateGoogleLogin} 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              background: 'white', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" style={{ width: '24px' }} alt="Google" />
            {loading ? "Verificando..." : "Continuar con Google"}
          </button>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Nombre Completo</label>
              <input 
                type="text" required 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nombre y Apellido"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>WhatsApp (Teléfono)</label>
              <input 
                type="tel" required 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Ej: 11 1234 5678"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
              {loading ? "Registrando..." : "Finalizar Registro"}
            </button>
          </form>
        )}

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'black', fontWeight: '600' }}>Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
