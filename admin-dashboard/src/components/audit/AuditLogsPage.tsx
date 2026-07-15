"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Loader2, AlertCircle, Activity, UserPlus, Swords, UserCog, Shield, Info } from "lucide-react";

interface ActivityEntry {
  id: string;
  type: "member_joined" | "role_change" | "tournament_created" | "member_updated";
  description: string;
  date: string;
  details: string;
}

const activityIcons: Record<string, React.ElementType> = {
  member_joined: UserPlus,
  role_change: Shield,
  tournament_created: Swords,
  member_updated: UserCog,
};

const activityColors: Record<string, string> = {
  member_joined: "#00E676",
  role_change: "#FFC107",
  tournament_created: "#E50914",
  member_updated: "#3B82F6",
};

const activityBg: Record<string, string> = {
  member_joined: "rgba(0,230,118,0.1)",
  role_change: "rgba(255,193,7,0.1)",
  tournament_created: "rgba(229,9,20,0.1)",
  member_updated: "rgba(59,130,246,0.1)",
};

export default function AuditLogsPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    setLoading(true);
    setError("");
    try {
      const [members, tournaments] = await Promise.all([
        api.getMembers().catch(() => []),
        api.getTournaments().catch(() => []),
      ]);

      const entries: ActivityEntry[] = [];

      (members || []).forEach((m: any) => {
        if (m.joinDate) {
          entries.push({
            id: `join-${m._id}`,
            type: "member_joined",
            description: `${m.name} انضم إلى الكلان`,
            date: m.joinDate,
            details: `الدور: ${m.role || "member"} | البلد: ${m.country || "—"}`,
          });
        }
        if (m.role && m.role !== "member") {
          entries.push({
            id: `role-${m._id}`,
            type: "role_change",
            description: `${m.name} تم تعيينه كـ ${m.role}`,
            date: m.joinDate || new Date().toISOString(),
            details: `المستوى: ${m.level || "—"} | معرف اللعبة: ${m.uid || "—"}`,
          });
        }
      });

      (tournaments || []).forEach((t: any) => {
        entries.push({
          id: `tournament-${t._id}`,
          type: "tournament_created",
          description: `تم إنشاء البطولة: ${t.title}`,
          date: t.createdAt || new Date().toISOString(),
          details: `${(t.participants || []).length} مشارك | ${t.game || "—"}`,
        });
      });

      entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setActivities(entries.slice(0, 20));
    } catch (err: any) {
      setError(err.message || "فشل تحميل سجل النشاطات");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#E50914] mx-auto" />
          <p className="text-[#9CA3AF] text-sm mt-4">جارٍ تحميل سجل النشاطات...</p>
        </div>
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={40} className="text-[#FF3B30] mx-auto" />
          <p className="text-[#FF3B30] text-sm mt-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">سجل النشاطات</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">تتبع النشاطات والتغييرات الأخيرة</p>
      </motion.div>

      <GlassCard className="bg-[rgba(255,193,7,0.05)] border border-[rgba(255,193,7,0.15)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,193,7,0.1)] flex items-center justify-center shrink-0">
            <Info size={20} className="text-[#FFC107]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FFC107]">بيانات تدقيق محدودة</p>
            <p className="text-xs text-[#9CA3AF] mt-1">
              التسجيل الكامل للتدقيق يتطلب نظام المصادقة ونقاط نهاية مخصصة للتدقيق.
              عرض آخر 20 نشاطاً تم إعادة بنائها من بيانات الأعضاء والبطولات المتاحة.
            </p>
          </div>
        </div>
      </GlassCard>

      {activities.length === 0 ? (
        <GlassCard>
          <div className="text-center py-10">
            <Activity size={48} className="text-[#6B7280] mx-auto mb-4" />
            <p className="text-[#9CA3AF] font-semibold">لا توجد نشاطات مسجلة</p>
            <p className="text-[#6B7280] text-sm mt-1">ستظهر النشاطات عند إضافة أعضاء وبطولات</p>
          </div>
        </GlassCard>
      ) : (
        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />
          <div className="space-y-3">
            {activities.map((entry, i) => {
              const Icon = activityIcons[entry.type] || Activity;
              const color = activityColors[entry.type] || "#9CA3AF";
              const bg = activityBg[entry.type] || "rgba(255,255,255,0.05)";

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-4 pl-0"
                >
                  <div
                    className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center shrink-0 relative z-10"
                    style={{ background: bg }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <GlassCard className="flex-1 !p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm text-white">{entry.description}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{entry.details}</p>
                      </div>
                      <Badge variant="default" size="sm" className="shrink-0">
                        {formatDate(entry.date)}
                      </Badge>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={loadActivities}
          className="text-xs text-[#6B7280] hover:text-white transition-colors font-semibold"
        >
          تحديث السجل
        </button>
      </div>
    </div>
  );
}
