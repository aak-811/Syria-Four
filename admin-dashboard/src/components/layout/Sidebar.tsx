"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_SIDEBAR_ITEMS, PUBLIC_SIDEBAR_ITEMS } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, Crown, Swords, Calendar, Medal, ShoppingCart,
  HeadphonesIcon, Camera, Image, Video, Bell, Hand, UserCog, History, Settings, LogOut,
  Shield,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  Users: <Users size={20} />,
  Crown: <Crown size={20} />,
  Swords: <Swords size={20} />,
  Calendar: <Calendar size={20} />,
  Medal: <Medal size={20} />,
  ShoppingCart: <ShoppingCart size={20} />,
  HeadphonesIcon: <HeadphonesIcon size={20} />,
  Instagram: <Camera size={20} />,
  Image: <Image size={20} />,
  Video: <Video size={20} />,
  Bell: <Bell size={20} />,
  Hand: <Hand size={20} />,
  UserCog: <UserCog size={20} />,
  History: <History size={20} />,
  Settings: <Settings size={20} />,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const isAdmin = pathname.startsWith("/admin");

  const items = (isAdmin ? ADMIN_SIDEBAR_ITEMS : PUBLIC_SIDEBAR_ITEMS) as (typeof ADMIN_SIDEBAR_ITEMS[number] & { badge?: number })[];

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <aside className="fixed top-0 right-0 h-screen w-[260px] z-40 hidden lg:flex flex-col bg-[#0A0A0A] border-l border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-3 px-6 h-[70px] border-b border-[rgba(255,255,255,0.06)] shrink-0">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#E50914] to-[#FF6B35] flex items-center justify-center">
          <img src="/images/clan-logo.png" alt="S4" className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-black text-sm">S4</span>';
            }}
          />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">SYRIA FOUR</h1>
          <p className="text-[10px] text-[#9CA3AF] font-medium">{isAdmin ? "مركز التحكم" : "الموقع الرسمي"}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium transition-all duration-300 relative",
                  isActive
                    ? "text-white bg-[rgba(229,9,20,0.15)]"
                    : "text-[#6B7280] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E50914] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={cn(isActive ? "text-[#E50914]" : "text-current")}>
                  {iconMap[item.icon]}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="mr-auto bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[rgba(255,255,255,0.06)] space-y-1">
        {!isAdmin && (
          <Link href="/admin/login">
            <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium text-[#6B7280] hover:text-[#FFD700] hover:bg-[rgba(229,9,20,0.1)] transition-all duration-300"
            >
              <Shield size={20} />
              <span>لوحة الإدارة</span>
            </motion.div>
          </Link>
        )}
        {isAdmin && (
          <>
            <Link href="/">
              <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium text-[#6B7280] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300"
              >
                <Shield size={20} />
                <span>الموقع العام</span>
              </motion.div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium text-[#6B7280] hover:text-[#FF3B30] hover:bg-[rgba(255,59,48,0.1)] transition-all duration-300 w-full"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
