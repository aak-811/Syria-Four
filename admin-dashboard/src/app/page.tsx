"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import Charts from "@/components/dashboard/Charts";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import LatestMembers from "@/components/dashboard/LatestMembers";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [support, setSupport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMembers(),
      api.getTournaments(),
      api.getOrders(),
      api.getSupport(),
    ])
      .then(([m, t, o, s]) => {
        setMembers(m);
        setTournaments(t);
        setOrders(o);
        setSupport(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Members", value: formatNumber(members.length), change: 0, icon: "Users", color: "#E50914" },
    { label: "Tournaments", value: formatNumber(tournaments.length), change: 0, icon: "Swords", color: "#FFD700" },
    { label: "Orders", value: formatNumber(orders.length), change: 0, icon: "ShoppingCart", color: "#00E676" },
    { label: "Support", value: formatNumber(support.length), change: 0, icon: "HeadphonesIcon", color: "#FF3B30" },
  ];

  const upcomingEvents = tournaments.filter((t) => t.type === "upcoming");

  if (loading) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <WelcomeBanner />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[140px] rounded-[20px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[400px] rounded-[20px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
            <div className="h-[400px] rounded-[20px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[300px] rounded-[20px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
            <div className="h-[300px] rounded-[20px] bg-[rgba(255,255,255,0.03)] animate-pulse" />
          </div>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <WelcomeBanner />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Charts />
          </div>
          <ActivityTimeline />
        </div>

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
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-[#6B7280]">No upcoming events</p>
              ) : (
                upcomingEvents.map((event, i) => (
                  <motion.div
                    key={event._id || event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-[14px] p-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                  >
                    <p className="font-semibold text-sm">{event.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#6B7280]">
                      <span>{event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}</span>
                      <span>{event.maxPlayers || "?"} players</span>
                    </div>
                  </motion.div>
                ))
              )}
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
