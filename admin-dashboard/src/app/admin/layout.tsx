"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";
import AdminMobileNav from "@/components/layout/AdminMobileNav";
import Spinner from "@/components/ui/Spinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    else document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  if (!mounted) return null;

  if (path === "/admin/login") return <>{children}</>;

  if (!isLoggedIn) {
    router.replace("/admin/login");
    return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] relative">
      <div className="admin-bg" />
      <div className="admin-grid" />
      <div className="relative z-10">
        <AdminSidebar />
        <AdminTopbar onToggleSidebar={() => setMobileOpen(true)} />

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-[var(--bg)] border-r border-[var(--border)] p-4 overflow-y-auto">
              <button onClick={() => setMobileOpen(false)}
                className="mb-4 w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
              >
                <span className="text-lg">✕</span>
              </button>
              <AdminSidebar />
            </div>
          </div>
        )}

        <main className="pt-[70px] pb-24 lg:pb-8 px-4 md:px-8 lg:mr-[260px] transition-all duration-300 relative">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
        <AdminMobileNav />
      </div>
    </div>
  );
}
