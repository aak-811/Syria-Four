"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";
import { X } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-[#050816]">
      <Sidebar />
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebar(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute top-0 right-0 bottom-0 w-[280px] bg-[#050816] border-l border-[rgba(255,255,255,0.06)] p-4"
            >
              <button
                onClick={() => setMobileSidebar(false)}
                className="mb-4 w-10 h-10 flex items-center justify-center rounded-full glass glass-hover"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Topbar onToggleSidebar={() => setMobileSidebar(true)} />
      <main className="pt-[70px] pb-24 lg:pb-8 px-4 md:px-8 lg:ml-0 transition-all duration-300"
        style={{ marginRight: "var(--sidebar-width, 260px)" }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
