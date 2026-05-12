"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") return null;

  return <>{children}</>;
}
