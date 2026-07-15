"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  ChevronDown,
  Menu,
  X,
  UserPlus,
  Trophy,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import { cn, timeAgo } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const isAdmin = pathname.startsWith("/admin");

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("AR");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isAdmin) api.getNotifications().then(setNotifications).catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) setQuickAddOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = notifications.filter((n) => n.active === true).length;

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dashboard_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dashboard_theme", "light");
    }
  };

  const toggleLang = () => {
    const next = lang === "AR" ? "EN" : "AR";
    setLang(next);
    document.documentElement.setAttribute("dir", next === "AR" ? "rtl" : "ltr");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(isAdmin ? "/admin/members" : "/members");
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleMarkAllRead = async () => {
    const active = notifications.filter((n) => n.active === true);
    if (active.length === 0) return;
    setMarkingAllRead(true);
    try {
      await Promise.all(active.map((n) => api.updateNotification(n.id, { active: false })));
      const updated = await api.getNotifications();
      setNotifications(updated);
    } catch {}
    setMarkingAllRead(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className={cn(
      "fixed top-0 right-0 left-0 h-[70px] z-30 bg-[rgba(10,10,10,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]",
      isAdmin ? "lg:right-[260px]" : ""
    )}>
      <div className="flex items-center justify-between h-full px-4 lg:px-8 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] rounded-[14px] px-4 py-2.5 w-[300px] focus-within:border-[#E50914] focus-within:shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-all duration-300">
            <Search size={18} className="text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="بحث..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6B7280] w-full"
            />
            <kbd className="text-[10px] text-[#6B7280] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
          >
            <Search size={18} />
          </button>

          <button
            onClick={toggleDark}
            className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full glass glass-hover"
            title={dark ? "إطفاء الإضاءة" : "تشغيل الإضاءة"}
          >
            {dark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={toggleLang}
            className="hidden sm:flex items-center gap-1.5 glass rounded-[14px] px-3 py-2 text-sm font-medium text-[#9CA3AF] glass-hover"
          >
            <span>{lang}</span>
            <ChevronDown size={14} />
          </button>

          {isAdmin && (
            <>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full glass glass-hover relative"
                  title="الإشعارات"
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#E50914] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-[360px] glass rounded-[18px] border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                        <h3 className="font-bold text-sm">الإشعارات</h3>
                        <button
                          onClick={handleMarkAllRead}
                          disabled={markingAllRead || unread === 0}
                          className="text-[11px] text-[#E50914] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {markingAllRead ? "جاري التحديث..." : "تحديد الكل كمقروء"}
                        </button>
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-[#6B7280] text-sm">لا توجد إشعارات</div>
                        ) : (
                          notifications.slice(0, 4).map((n) => (
                            <div
                              key={n.id}
                              className={cn(
                                "flex items-start gap-3 p-4 border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer",
                                n.active && "bg-[rgba(229,9,20,0.04)]"
                              )}
                            >
                              <div
                                className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", {
                                  "bg-[#00E676]": n.type === "success",
                                  "bg-[#FFC107]": n.type === "warning",
                                  "bg-[#E50914]": n.type === "error",
                                  "bg-[#6B7280]": n.type === "info",
                                })}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold">{n.title}</p>
                                <p className="text-xs text-[#9CA3AF] truncate">{n.message}</p>
                                <p className="text-[10px] text-[#6B7280] mt-1">{timeAgo(n.createdAt)}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={quickAddRef}>
                <button
                  onClick={() => setQuickAddOpen(!quickAddOpen)}
                  className="hidden sm:flex items-center gap-2 bg-[#E50914] hover:bg-[#B00812] text-white px-5 py-2.5 rounded-[14px] text-sm font-semibold transition-all duration-300 active:scale-95"
                >
                  <Plus size={18} />
                  <span>إضافة سريعة</span>
                </button>

                <AnimatePresence>
                  {quickAddOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-[200px] glass rounded-[14px] border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => { router.push("/admin/members/add"); setQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <UserPlus size={16} className="text-[#9CA3AF]" />
                        إضافة عضو
                      </button>
                      <button
                        onClick={() => { router.push("/admin/tournaments/add"); setQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <Trophy size={16} className="text-[#9CA3AF]" />
                        إضافة بطولة
                      </button>
                      <button
                        onClick={() => { router.push("/admin/notifications/add"); setQuickAddOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <Bell size={16} className="text-[#9CA3AF]" />
                        إضافة إشعار
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 glass rounded-[14px] px-3 py-2 glass-hover cursor-pointer"
            >
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" size="sm" status="online" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight">المدير</p>
                <p className="text-[10px] text-[#9CA3AF]">مالك</p>
              </div>
            </div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-[200px] glass rounded-[14px] border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden"
                >
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => { router.push("/admin/settings"); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <Settings size={16} className="text-[#9CA3AF]" />
                        الإعدادات
                      </button>
                      <div className="border-t border-[rgba(255,255,255,0.06)]" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#E50914] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <LogOut size={16} />
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <Link href="/admin/login" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors no-underline">
                      <Shield size={16} className="text-[#9CA3AF]" />
                      لوحة الإدارة
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pb-4"
          >
            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] rounded-[14px] px-4 py-3 focus-within:border-[#E50914] focus-within:shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-all duration-300">
              <Search size={18} className="text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="بحث..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6B7280] w-full"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-[#6B7280]">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
