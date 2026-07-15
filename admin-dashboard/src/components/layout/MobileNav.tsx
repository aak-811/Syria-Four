"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Crown, Swords, Image, ShoppingCart, HeadphonesIcon, Hand, Bell, Settings, Plus } from "lucide-react";

type NavItem = { label: string; icon: any; href: string; fab?: boolean };

const publicItems: NavItem[] = [
  { label: "الرئيسية", icon: LayoutDashboard, href: "/" },
  { label: "الأعضاء", icon: Users, href: "/members" },
  { label: "القيادات", icon: Crown, href: "/leaders" },
  { label: "البطولات", icon: Swords, href: "/tournaments" },
];

const adminItems: NavItem[] = [
  { label: "الرئيسية", icon: LayoutDashboard, href: "/admin" },
  { label: "الأعضاء", icon: Users, href: "/admin/members" },
  { label: "إضافة", icon: Plus, href: "#", fab: true },
  { label: "الإشعارات", icon: Bell, href: "/admin/notifications" },
  { label: "الإعدادات", icon: Settings, href: "/admin/settings" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const items = isAdmin ? adminItems : publicItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)] px-2 pb-2 pt-2">
        <div className="flex items-center justify-around relative">
          {items.map((item) => {
            const isActive = pathname === item.href;
            if (item.fab) {
              return (
                <motion.button
                  key="fab"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 bg-gradient-to-br from-[#E50914] to-[#FF6B35] rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-[rgba(229,9,20,0.3)]"
                >
                  <Plus size={24} className="text-white" />
                </motion.button>
              );
            }
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-4 py-1">
                <div className={cn("p-2 rounded-full transition-all duration-300", isActive && "bg-[rgba(229,9,20,0.15)]")}>
                  <item.icon size={20} className={isActive ? "text-[#E50914]" : "text-[#6B7280]"} />
                </div>
                <span className={cn("text-[10px] font-medium", isActive ? "text-[#E50914]" : "text-[#6B7280]")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
