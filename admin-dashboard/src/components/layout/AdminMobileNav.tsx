"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LayoutDashboard, Users, Crown, Swords, Calendar, Image as ImageIcon,
  ShoppingBag, MessageSquare, Shield, Globe, Menu, X, Medal, Award
} from "lucide-react";

type NavItem = { label: string; icon: any; href: string };

const mainItems: NavItem[] = [
  { label: "الرئيسية", icon: LayoutDashboard, href: "/admin" },
  { label: "الأعضاء", icon: Users, href: "/admin/members" },
  { label: "القيادات", icon: Crown, href: "/admin/leaders" },
  { label: "البطولات", icon: Swords, href: "/admin/tournaments" },
];

const moreItems: NavItem[] = [
  { label: "الفعاليات", icon: Calendar, href: "/admin/events" },
  { label: "الأوسمة", icon: Medal, href: "/admin/awards" },
  { label: "VIP", icon: Crown, href: "/admin/vip" },
  { label: "قاعة المشاهير", icon: Award, href: "/admin/hall-of-fame" },
  { label: "المعرض والفيديو", icon: ImageIcon, href: "/admin/gallery" },
  { label: "الطلبات", icon: ShoppingBag, href: "/admin/orders" },
  { label: "الدعم", icon: MessageSquare, href: "/admin/support" },
  { label: "الإعدادات", icon: Shield, href: "/admin/settings" },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [showAll, setShowAll] = useState(false);

  const activeColor = "#00E5FF";
  const inactiveColor = "#6B7280";

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-[rgba(5,8,22,0.98)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)] px-2 pb-2 pt-2">
          <div className="flex items-center justify-around relative">
            {mainItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-3 py-1">
                  <div className={cn("p-2 rounded-full transition-all duration-300", isActive && "bg-[rgba(0,229,255,0.12)]")}>
                    <Icon size={20} className={isActive ? activeColor : inactiveColor} />
                  </div>
                  <span className={cn("text-[9px] font-medium", isActive ? "text-[#00E5FF]" : inactiveColor)}>{item.label}</span>
                </Link>
              );
            })}

            <button onClick={() => setShowAll(!showAll)}
              className="flex flex-col items-center gap-1 px-3 py-1 relative"
            >
              <div className={cn("p-2 rounded-full transition-all duration-300", showAll && "bg-[rgba(0,229,255,0.12)]")}>
                <Menu size={20} className={showAll ? activeColor : inactiveColor} />
              </div>
              <span className="text-[9px] font-medium text-[#6B7280]">المزيد</span>
            </button>

            <Link href="/" className="flex flex-col items-center gap-1 px-3 py-1">
              <div className="p-2 rounded-full">
                <Globe size={20} className={inactiveColor} />
              </div>
              <span className="text-[9px] font-medium text-[#6B7280]">الموقع</span>
            </Link>
          </div>
        </div>
      </nav>

      {showAll && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowAll(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#050816] border-t border-[rgba(255,255,255,0.06)] rounded-t-3xl max-h-[60vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">جميع الأقسام</h3>
                <button onClick={() => setShowAll(false)} className="w-8 h-8 flex items-center justify-center rounded-full glass">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[...mainItems, ...moreItems].map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setShowAll(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-[16px] transition-all duration-300",
                        isActive ? "bg-[rgba(0,229,255,0.1)]" : "bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]"
                      )}
                    >
                      <Icon size={24} className={isActive ? activeColor : "#9CA3AF"} />
                      <span className={cn("text-[10px] font-medium", isActive ? "text-[#00E5FF]" : "#9CA3AF")}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
