import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYRIA FOUR - Control Center",
  description: "Premium Free Fire Clan Management Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
