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

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">لوحة التحكم</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">نظرة عامة على الكلان</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Users size={22} />} label="الأعضاء" value={stats.members || 0} color="var(--primary)" />
        <StatsCard icon={<Swords size={22} />} label="البطولات" value={stats.tournaments || 0} color="var(--secondary)" />
        <StatsCard icon={<Calendar size={22} />} label="الفعاليات" value={stats.events || 0} color="var(--success)" />
        <StatsCard icon={<Image size={22} />} label="الصور" value={stats.gallery || 0} color="var(--warning)" />
        <StatsCard icon={<Bell size={22} />} label="الإشعارات" value={stats.notifications || 0} color="#FF6B35" />
        <StatsCard icon={<ShoppingBag size={22} />} label="الطلبات" value={stats.orders || 0} color="#5865F2" />
        <StatsCard icon={<MessageSquare size={22} />} label="الدعم" value={stats.support || 0} color="#25D366" />
      </div>

      <Card>
        <h2 className="font-bold text-lg mb-4">مرحباً بك في لوحة التحكم</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          من هنا يمكنك إدارة جميع جوانب الكلان: الأعضاء، البطولات، الفعاليات،
          الصور، الفيديو، الطلبات، الدعم، الإشعارات، والمزيد.
        </p>
      </Card>
    </div>
  );
}
