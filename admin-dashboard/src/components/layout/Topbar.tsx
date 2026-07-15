"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Sun, Moon, Plus, ChevronDown, Menu, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { NOTIFICATIONS_DATA } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const unread = NOTIFICATIONS_DATA.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 right-0 left-0 lg:right-[260px] h-[70px] z-30 bg-[rgba(10,10,10,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between h-full px-4 lg:px-8 gap-4">
        {/* Mobile menu + Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
          >
            <Menu size={20} />
          </button>

          {/* Search Desktop */}
          <div className="hidden md:flex items-center gap-2 glass rounded-[14px] px-4 py-2.5 w-[300px]">
            <Search size={18} className="text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search members, tournaments..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6B7280] w-full"
            />
            <kbd className="text-[10px] text-[#6B7280] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search Mobile Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
          >
            <Search size={18} />
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full glass glass-hover"
          >
            {dark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language */}
          <button className="hidden sm:flex items-center gap-1.5 glass rounded-[14px] px-3 py-2 text-sm font-medium text-[#9CA3AF] glass-hover">
            <span>AR</span>
            <ChevronDown size={14} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full glass glass-hover relative"
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
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <span className="text-[11px] text-[#E50914] font-medium cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {NOTIFICATIONS_DATA.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "flex items-start gap-3 p-4 border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer",
                          !n.read && "bg-[rgba(229,9,20,0.04)]"
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
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Add */}
          <button className="hidden sm:flex items-center gap-2 bg-[#E50914] hover:bg-[#B00812] text-white px-5 py-2.5 rounded-[14px] text-sm font-semibold transition-all duration-300 active:scale-95">
            <Plus size={18} />
            <span>Quick Add</span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 glass rounded-[14px] px-3 py-2 glass-hover cursor-pointer">
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" size="sm" status="online" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight">Admin</p>
              <p className="text-[10px] text-[#9CA3AF]">Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pb-4"
          >
            <div className="flex items-center gap-2 glass rounded-[14px] px-4 py-3">
              <Search size={18} className="text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6B7280] w-full"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
