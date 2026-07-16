"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Menu, LogOut, Settings, Shield, ChevronDown,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { cn, timeAgo } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import VisitorCounter from "@/components/ui/VisitorCounter";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const isAdmin = pathname.startsWith("/admin");

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdmin) api.getNotifications().then(setNotifications).catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = notifications.filter((n) => n.active === true).length;

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
      "fixed top-0 right-0 left-0 h-[70px] z-30 bg-[rgba(5,8,22,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]",
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
          <span className="text-sm font-bold hidden md:block">
            {isAdmin ? "لوحة التحكم" : "SYRIA FOUR"}
          </span>
          {!isAdmin && <VisitorCounter />}
        </div>

        <div className="flex items-center gap-2">
          {/* Home/Back link for admin pages */}
          {isAdmin && (
            <Link href="/"
              className="hidden sm:flex items-center gap-1.5 glass rounded-[14px] px-3 py-2 text-sm font-medium text-[#9CA3AF] hover:text-white glass-hover"
            >
              <Shield size={16} />
              <span>الموقع العام</span>
            </Link>
          )}

          {/* Notifications - admin only */}
          {isAdmin && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full glass glass-hover relative"
                title="الإشعارات"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#00E5FF] text-[#050816] text-[9px] font-bold rounded-full flex items-center justify-center">
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
                        className="text-[11px] text-[#00E5FF] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", {
                              "bg-[#00E676]": n.type === "success",
                              "bg-[#FFC107]": n.type === "warning",
                              "bg-[#E50914]": n.type === "error",
                              "bg-[#6B7280]": n.type === "info",
                            })} />
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
          )}



          {/* Profile / Admin section */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 glass rounded-[14px] px-3 py-2 glass-hover cursor-pointer"
            >
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight">{isAdmin ? "الإدارة" : "الموقع"}</p>
                <p className="text-[10px] text-[#9CA3AF]">{isAdmin ? "مدير النظام" : "SYRIA FOUR"}</p>
              </div>
              <ChevronDown size={14} className="text-[#6B7280]" />
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
                      <Link href="/admin/settings"
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors no-underline"
                      >
                        <Settings size={16} className="text-[#9CA3AF]" />
                        الإعدادات
                      </Link>
                      <Link href="/"
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors no-underline"
                      >
                        <Shield size={16} className="text-[#9CA3AF]" />
                        الموقع العام
                      </Link>
                      <div className="border-t border-[rgba(255,255,255,0.06)]" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FF3B30] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <LogOut size={16} />
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <Link href="/admin/login"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors no-underline"
                    >
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
    </header>
  );
}
