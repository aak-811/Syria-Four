"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import StatsCard from "@/components/admin/StatsCard";
import { api } from "@/lib/api";
import { Users, Swords, Calendar, Image, Bell, ShoppingBag, MessageSquare } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMembers().catch(() => []),
      api.getTournaments().catch(() => []),
      api.getEvents().catch(() => []),
      api.getGallery().catch(() => []),
      api.getNotifications().catch(() => []),
      api.getOrders().catch(() => []),
      api.getSupport().catch(() => []),
    ]).then(([m, t, e, g, n, o, s]) => {
      setStats({ members: m.length, tournaments: t.length, events: e.length, gallery: g.length, notifications: n.length, orders: o.length, support: s.length });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Spinner /></div>;

  return (
    <div className="space-y-8">
      <div className="animate-fade-slide-up">
        <h1 className="text-3xl font-black gradient-text inline-block">لوحة التحكم</h1>
        <p className="text-[var(--text-muted)] text-sm mt-2">نظرة عامة على كلان SYRIA FOUR</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { icon: <Users size={22} />, label: "الأعضاء", value: stats.members || 0, color: "#00E5FF", delay: 0 },
          { icon: <Swords size={22} />, label: "البطولات", value: stats.tournaments || 0, color: "#8B5CF6", delay: 0.05 },
          { icon: <Calendar size={22} />, label: "الفعاليات", value: stats.events || 0, color: "#00E676", delay: 0.1 },
          { icon: <Image size={22} />, label: "الصور", value: stats.gallery || 0, color: "#FFD700", delay: 0.15 },
          { icon: <Bell size={22} />, label: "الإشعارات", value: stats.notifications || 0, color: "#FF6B35", delay: 0.2 },
          { icon: <ShoppingBag size={22} />, label: "الطلبات", value: stats.orders || 0, color: "#5865F2", delay: 0.25 },
          { icon: <MessageSquare size={22} />, label: "الدعم", value: stats.support || 0, color: "#25D366", delay: 0.3 },
        ].map((s, i) => (
          <div key={s.label} className="animate-fade-slide-up" style={{ animationDelay: `${s.delay}s` }}>
            <StatsCard icon={s.icon} label={s.label} value={s.value} color={s.color} />
          </div>
        ))}
      </div>

      <div className="animate-fade-slide-up" style={{ animationDelay: "0.35s" }}>
        <Card className="admin-welcome-gradient !p-8">
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-3 bg-gradient-to-l from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent">
              مرحباً بك في لوحة التحكم
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
              من هنا يمكنك إدارة جميع جوانب <span className="text-[#00E5FF] font-semibold">SYRIA FOUR</span>:
              الأعضاء، البطولات، الفعاليات، الصور، الفيديو، الطلبات، الدعم، الإشعارات، والمزيد.
              كل ما تحتاجه لإدارة الكلان في مكان واحد.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-[11px] text-[#6B7280]">النظام يعمل بكامل طاقته — {stats.members || 0} عضو، {stats.tournaments || 0} بطولة</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
