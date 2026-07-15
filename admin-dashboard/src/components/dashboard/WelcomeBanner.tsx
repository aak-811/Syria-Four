"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <GlassCard className="relative overflow-hidden p-8 md:p-10">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(229,9,20,0.08)] via-transparent to-[rgba(255,215,0,0.04)]" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[rgba(229,9,20,0.06)] blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[rgba(255,215,0,0.04)] blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-[#FFD700]" />
              <span className="text-xs font-semibold text-[#FFD700] uppercase tracking-wider">SYRIA FOUR Control Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              Welcome back,{" "}
              <span className="text-gradient">Admin</span>
            </h1>
            <p className="text-[#9CA3AF] text-base max-w-xl">
              Your clan is thriving. 12 new members joined this week, and tournament registrations are up 24%.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-shrink-0"
        >
          <Button variant="secondary" size="lg" glow>
            <Sparkles size={18} />
            Create Tournament
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </GlassCard>
  );
}
