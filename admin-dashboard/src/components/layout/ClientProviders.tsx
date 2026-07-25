"use client";

import { AuthProvider } from "@/lib/auth-context";
import { useEffect } from "react";

function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
      <PWARegister />
    </>
  );
}
