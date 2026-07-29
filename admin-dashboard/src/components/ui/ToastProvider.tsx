"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      dir="rtl"
      toastOptions={{
        style: {
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fff",
          borderRadius: "14px",
          padding: "12px 16px",
          fontSize: "14px",
        },
      }}
    />
  );
}
