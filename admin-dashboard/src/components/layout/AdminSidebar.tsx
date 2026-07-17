"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Crown, Swords, Calendar, Image,
  ShoppingBag, MessageSquare, Camera, Bell, ClipboardList, Shield, FileText, Settings, LogOut, Globe,
  Medal, Diamond, Award
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const items = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/members", label: "الأعضاء", icon: Users },
  { href: "/admin/leaders", label: "القيادات", icon: Crown },
  { href: "/admin/tournaments", label: "البطولات", icon: Swords },
  { href: "/admin/events", label: "الفعاليات", icon: Calendar },
  { href: "/admin/awards", label: "الأوسمة", icon: Medal },
  { href: "/admin/vip", label: "VIP", icon: Crown },
  { href: "/admin/hall-of-fame", label: "قاعة المشاهير", icon: Award },
  { href: "/admin/gallery", label: "المعرض والفيديو", icon: Image },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/support", label: "الدعم", icon: MessageSquare },
  { href: "/admin/instagram", label: "إنستغرام", icon: Camera },
  { href: "/admin/notifications", label: "الإشعارات", icon: Bell },
  { href: "/admin/requests", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/users", label: "المستخدمين", icon: Shield },
  { href: "/admin/audit", label: "سجل النشاط", icon: FileText },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminSidebar() {
  const path = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed top-0 right-0 bottom-0 w-[260px] border-l border-[var(--border)] bg-[var(--bg)] hidden lg:flex flex-col z-30">
      <div className="flex items-center gap-2 h-[70px] px-5 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
          <span className="text-white font-black text-sm">S4</span>
        </div>
        <span className="font-bold text-sm">لوحة التحكم</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {items.map(item => {
          const active = path === item.href || (item.href !== "/admin" && path.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[rgba(0,229,255,0.1)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)] space-y-0.5">
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[rgba(0,229,255,0.08)] w-full transition-all duration-200 no-underline"
        >
          <Globe size={18} /> الموقع العام
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[rgba(229,9,20,0.1)] w-full transition-all duration-200"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
