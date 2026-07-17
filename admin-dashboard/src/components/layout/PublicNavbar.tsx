"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/members", label: "الأعضاء" },
  { href: "/leaders", label: "القيادات" },
  { href: "/tournaments", label: "البطولات" },
  { href: "/events", label: "الفعاليات" },
  { href: "/gallery", label: "المعرض" },
  { href: "/assistant", label: "المساعد" },
  { href: "/rules", label: "القوانين" },
  { href: "/shop", label: "الشحن" },
  { href: "/support", label: "الدعم" },
];

export default function PublicNavbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-[70px]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
            <span className="text-white font-black text-sm">S4</span>
          </div>
          <span className="font-bold text-sm hidden sm:block">SYRIA FOUR</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-200",
                path === l.href
                  ? "bg-[var(--surface)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-[10px] glass glass-hover"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] p-4 space-y-1 animate-fade-in">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all",
                path === l.href
                  ? "bg-[var(--surface)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
