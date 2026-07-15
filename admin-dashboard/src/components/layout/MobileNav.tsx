"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LayoutDashboard, Users, Crown, Swords, Calendar, Image, ShoppingCart,
  HeadphonesIcon, Hand, Bell, Settings, Plus, Shield, Medal, Menu, X, ChevronDown,
} from "lucide-react";

type NavItem = { label: string; icon: any; href: string; fab?: boolean };

const publicItems: NavItem[] = [
  { label: "الرئيسية", icon: LayoutDashboard, href: "/" },
  { label: "القيادات", icon: Crown, href: "/leaders" },
  { label: "الأعضاء", icon: Users, href: "/members" },
  { label: "البطولات", icon: Swords, href: "/tournaments" },
  { label: "الفعاليات", icon: Calendar, href: "/events" },
  { label: "المعرض", icon: Image, href: "/gallery" },
  { label: "الشحن", icon: ShoppingCart, href: "/shop" },
  { label: "القوانين", icon: Hand, href: "/rules" },
  { label: "الدعم", icon: HeadphonesIcon, href: "/support" },
];

const adminItems: NavItem[] = [
  { label: "الرئيسية", icon: LayoutDashboard, href: "/admin" },
  { label: "الأعضاء", icon: Users, href: "/admin/members" },
  { label: "القيادات", icon: Crown, href: "/admin/leaders" },
  { label: "البطولات", icon: Swords, href: "/admin/tournaments" },
  { label: "الفعاليات", icon: Calendar, href: "/admin/events" },
  { label: "المعرض", icon: Image, href: "/admin/gallery" },
  { label: "الشحن", icon: ShoppingCart, href: "/admin/orders" },
  { label: "الدعم", icon: HeadphonesIcon, href: "/admin/support" },
  { label: "الإعدادات", icon: Settings, href: "/admin/settings" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [showAll, setShowAll] = useState(false);

  const mainItems = isAdmin
    ? adminItems.slice(0, 4)
    : publicItems.slice(0, 4);

  const moreItems = isAdmin
    ? adminItems.slice(4)
    : publicItems.slice(4);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-[rgba(10,10,10,0.98)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)] px-2 pb-2 pt-2">
          <div className="flex items-center justify-around relative">
            {mainItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-3 py-1">
                  <div className={cn("p-2 rounded-full transition-all duration-300", isActive && "bg-[rgba(229,9,20,0.15)]")}>
                    <item.icon size={20} className={isActive ? "text-[#E50914]" : "text-[#6B7280]"} />
                  </div>
                  <span className={cn("text-[9px] font-medium", isActive ? "text-[#E50914]" : "text-[#6B7280]")}>{item.label}</span>
                </Link>
              );
            })}

            {/* More button */}
            <button onClick={() => setShowAll(!showAll)}
              className="flex flex-col items-center gap-1 px-3 py-1 relative"
            >
              <div className={cn("p-2 rounded-full transition-all duration-300", showAll && "bg-[rgba(229,9,20,0.15)]")}>
                <Menu size={20} className={showAll ? "text-[#E50914]" : "text-[#6B7280]"} />
              </div>
              <span className="text-[9px] font-medium text-[#6B7280]">المزيد</span>
            </button>

            {/* Admin / Public link */}
            {!isAdmin && (
              <Link href="/admin/login" className="flex flex-col items-center gap-1 px-3 py-1">
                <div className="p-2 rounded-full">
                  <Shield size={20} className="text-[#6B7280]" />
                </div>
                <span className="text-[9px] font-medium text-[#6B7280]">الإدارة</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Expanded More Menu */}
      <AnimatePresence>
        {showAll && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setShowAll(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)] rounded-t-3xl max-h-[60vh] overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">جميع الأقسام</h3>
                  <button onClick={() => setShowAll(false)} className="w-8 h-8 flex items-center justify-center rounded-full glass">
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(isAdmin ? adminItems : publicItems).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setShowAll(false)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-[16px] transition-all duration-300",
                          isActive ? "bg-[rgba(229,9,20,0.12)]" : "bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]"
                        )}
                      >
                        <item.icon size={24} className={isActive ? "text-[#E50914]" : "text-[#9CA3AF]"} />
                        <span className={cn("text-[10px] font-medium", isActive ? "text-[#E50914]" : "text-[#9CA3AF]")}>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
