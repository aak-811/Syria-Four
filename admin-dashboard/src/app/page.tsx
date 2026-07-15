"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import Charts from "@/components/dashboard/Charts";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import LatestMembers from "@/components/dashboard/LatestMembers";
import { STATS_DATA } from "@/lib/data";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <WelcomeBanner />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS_DATA.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Charts />
          </div>
          <ActivityTimeline />
        </div>

        {/* Latest Members + Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LatestMembers />
          </div>
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Upcoming Events</h3>
              <Calendar size={20} className="text-[#6B7280]" />
            </div>
            <div className="space-y-4">
              {[
                { title: "Arena Wars Tournament", date: "Dec 15, 2025", time: "8:00 PM", players: 32 },
                { title: "Community Stream Night", date: "Dec 18, 2025", time: "9:00 PM", players: 128 },
                { title: "Season 7 Launch", date: "Jan 1, 2026", time: "12:00 AM", players: 500 },
              ].map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-[14px] p-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                >
                  <p className="font-semibold text-sm">{event.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#6B7280]">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                    <span>{event.players} players</span>
                  </div>
                </motion.div>
              ))}
              <button className="flex items-center gap-1 text-sm text-[#E50914] font-semibold hover:underline mt-2">
                View Calendar <ArrowRight size={16} />
              </button>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
