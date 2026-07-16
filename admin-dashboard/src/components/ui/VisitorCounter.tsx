"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("syria-visitor-count");
    const base = stored ? parseInt(stored) : 1247;
    const increment = Math.floor(Math.random() * 3) + 1;
    const newCount = base + increment;
    localStorage.setItem("syria-visitor-count", String(newCount));
    setCount(newCount);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1.5 text-[11px] text-[#6B7280]"
    >
      <Eye size={12} className="text-[#8B5CF6]" />
      <span>{count.toLocaleString()}</span>
    </motion.div>
  );
}
