"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Swords, Calendar, Image as ImageIcon,
  ShoppingCart, HeadphonesIcon, Hand, Bot, MapPin, Sun, Moon,
} from "lucide-react";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  Users: <Users size={20} />,
  MapPin: <MapPin size={20} />,
  Swords: <Swords size={20} />,
  Calendar: <Calendar size={20} />,
  Image: <ImageIcon size={20} />,
  ShoppingCart: <ShoppingCart size={20} />,
  HeadphonesIcon: <HeadphonesIcon size={20} />,
  Hand: <Hand size={20} />,
  Bot: <Bot size={20} />,
};

const publicItems = [
  { icon: "LayoutDashboard", label: "الرئيسية", href: "/" },
  { icon: "Users", label: "الأعضاء", href: "/members" },
  { icon: "MapPin", label: "أحدث الأعضاء", href: "/new-members" },
  { icon: "Swords", label: "البطولات", href: "/tournaments" },
  { icon: "Calendar", label: "الفعاليات", href: "/events" },
  { icon: "Image", label: "المعرض", href: "/gallery" },
  { icon: "Bot", label: "المساعد", href: "/assistant" },
  { icon: "Hand", label: "القوانين", href: "/rules" },
  { icon: "ShoppingCart", label: "الشحن", href: "/shop" },
  { icon: "HeadphonesIcon", label: "الدعم", href: "/support" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("site_theme");
    if (saved) {
      setDark(saved === "dark");
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    const val = next ? "dark" : "light";
    localStorage.setItem("site_theme", val);
    document.documentElement.setAttribute("data-theme", val);
  };

  return (
    <aside className="fixed top-0 right-0 h-screen w-[260px] z-40 hidden lg:flex flex-col bg-[#050816] border-l border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-3 px-6 h-[70px] border-b border-[rgba(255,255,255,0.06)] shrink-0">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center">
          <span className="text-white font-black text-sm">S4</span>
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">SYRIA FOUR</h1>
          <p className="text-[10px] text-[#9CA3AF] font-medium">الموقع الرسمي</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {publicItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium transition-all duration-300 relative",
                  isActive
                    ? "text-white bg-[rgba(0,229,255,0.1)]"
                    : "text-[#6B7280] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00E5FF] rounded-full" />
                )}
                <span className={cn(isActive ? "text-[#00E5FF]" : "text-current")}>
                  {iconMap[item.icon]}
                </span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[rgba(255,255,255,0.06)] space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium text-[#6B7280] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 w-full border-0 cursor-pointer text-right"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{dark ? "الوضع الفاتح" : "الوضع الليلي"}</span>
        </button>
      </div>
    </aside>
  );
}
