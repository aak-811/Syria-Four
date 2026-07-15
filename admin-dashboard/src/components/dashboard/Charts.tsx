"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { CHART_DATA } from "@/lib/data";

const tabs = [
  { id: "members", label: "نمو الأعضاء" },
  { id: "weekly", label: "إحصائيات أسبوعية" },
  { id: "matches", label: "نسبة المباريات" },
];

export default function Charts() {
  const [activeTab, setActiveTab] = useState("members");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-[12px] px-4 py-3 text-sm border border-[rgba(255,255,255,0.08)]">
          <p className="text-[#9CA3AF] text-xs mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }} className="font-semibold">
              {p.name}: {p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">التحليلات</h3>
        <div className="flex gap-1 glass rounded-[12px] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-[10px] transition-all duration-300",
                activeTab === tab.id
                  ? "bg-[#E50914] text-white"
                  : "text-[#6B7280] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        {activeTab === "members" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA.members}>
              <defs>
                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E50914" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E50914" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#E50914" fill="url(#colorMembers)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === "weekly" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA.weekly} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="active" name="نشط" fill="#E50914" radius={[6, 6, 0, 0]} />
              <Bar dataKey="new" name="جديد" fill="#FFD700" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === "matches" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CHART_DATA.matches}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {CHART_DATA.matches.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {activeTab === "matches" && (
        <div className="flex justify-center gap-6 mt-4">
          {CHART_DATA.matches.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
              <span className="text-xs text-[#9CA3AF]">{entry.name}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
