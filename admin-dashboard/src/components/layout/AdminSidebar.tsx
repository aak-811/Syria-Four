"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Crown, Swords, Calendar, Image,
  ShoppingBag, MessageSquare, Camera, Bell, ClipboardList, LogOut,
  Medal, Award, Sparkles, Sun, Moon
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

const items = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, color: "#00E5FF" },
  { href: "/admin/members", label: "الأعضاء", icon: Users, color: "#00E5FF" },
  { href: "/admin/tournaments", label: "البطولات", icon: Swords, color: "#8B5CF6" },
  { href: "/admin/events", label: "الفعاليات", icon: Calendar, color: "#00E676" },
  { href: "/admin/awards", label: "الأوسمة", icon: Medal, color: "#FFD700" },
  { href: "/admin/vip", label: "VIP", icon: Crown, color: "#FFD700" },
  { href: "/admin/hall-of-fame", label: "قاعة المشاهير", icon: Award, color: "#FFD700" },
  { href: "/admin/gallery", label: "المعرض والفيديو", icon: Image, color: "#FF6B35" },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag, color: "#5865F2" },
  { href: "/admin/support", label: "الدعم", icon: MessageSquare, color: "#25D366" },
  { href: "/admin/instagram", label: "إنستغرام", icon: Camera, color: "#E1306C" },
  { href: "/admin/notifications", label: "الإشعارات", icon: Bell, color: "#FF6B35" },
  { href: "/admin/requests", label: "الطلبات", icon: ClipboardList, color: "#8B5CF6" },
];

export default function AdminSidebar() {
  const path = usePathname();
  const { logout } = useAuth();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("site_theme");
    if (saved) setDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("site_theme", next ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  return (
    <aside className="fixed top-0 right-0 bottom-0 w-[260px] border-l border-[var(--border)] bg-[var(--bg)] hidden lg:flex flex-col z-30">
      <div className="flex items-center gap-2 h-[70px] px-5 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
          <span className="text-white font-black text-sm">S4</span>
        </div>
        <span className="font-bold text-sm">لوحة التحكم</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-hide">
        {items.map((item, idx) => {
          const active = path === item.href || (item.href !== "/admin" && path.startsWith(item.href));
          const Icon = item.icon;
          return (
            <div key={item.href}>
              {idx === 1 && <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />}
              {idx === 8 && <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />}
              {idx === 13 && <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />}
              <Link
                href={item.href}
                className={cn(
                  "sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-300 no-underline",
                  active
                    ? "active text-white"
                    : "text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]"
                )}
              >
                <span className="sidebar-icon flex items-center justify-center w-5 h-5" style={{ color: active ? item.color : undefined }}>
                  <Icon size={18} />
                </span>
                <span>{item.label}</span>
                {active && (
                  <span className="mr-auto flex items-center">
                    <Sparkles size={10} className="text-[#00E5FF] animate-pulse" />
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)] space-y-0.5">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[rgba(0,229,255,0.08)] w-full transition-all duration-200 border-0 cursor-pointer"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {dark ? "الوضع الفاتح" : "الوضع الليلي"}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[rgba(229,9,20,0.1)] w-full transition-all duration-200 border-0 cursor-pointer"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
