"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import StatsCard from "@/components/admin/StatsCard";
import Modal from "@/components/ui/Modal";
import { FormInput } from "@/components/admin/FormField";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { Users, Swords, Calendar, Image, Bell, ShoppingBag, MessageSquare, Camera, Plus, Trash2, RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [instagramData, setInstagramData] = useState<any[]>([]);
  const [instaModal, setInstaModal] = useState(false);
  const [instaForm, setInstaForm] = useState<any>({});

  const load = () => {
    setLoading(true);
    Promise.all([
      api.getMembers().catch(() => []),
      api.getTournaments().catch(() => []),
      api.getEvents().catch(() => []),
      api.getGallery().catch(() => []),
      api.getNotifications().catch(() => []),
      api.getOrders().catch(() => []),
      api.getSupport().catch(() => []),
      api.getInstagram().catch(() => []),
    ]).then(([m, t, e, g, n, o, s, insta]) => {
      setStats({ members: m.length, tournaments: t.length, events: e.length, gallery: g.length, notifications: n.length, orders: o.length, support: s.length, instagram: insta.length });
      setInstagramData(insta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const addInsta = async () => {
    if (!instaForm.name || !instaForm.username) return;
    await api.addInstagram(instaForm);
    setInstaModal(false);
    setInstaForm({});
    load();
  };

  const deleteInsta = async (id: string) => {
    if (!confirm("حذف حساب Instagram?")) return;
    await api.deleteInstagram(id);
    load();
  };

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
          { icon: <Camera size={22} />, label: "Instagram", value: stats.instagram || 0, color: "#E4405F", delay: 0.03 },
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

      {/* Instagram Accounts Section */}
      <div className="animate-fade-slide-up" style={{ animationDelay: "0.08s" }}>
        <Card className="!p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera size={18} className="text-[#E4405F]" />
              <h3 className="font-bold text-sm">حسابات Instagram</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={load} className="p-2 rounded-[10px] glass hover:bg-[var(--surface-hover)] transition-colors" title="تحديث"><RefreshCw size={15} /></button>
              <Button onClick={() => { setInstaForm({}); setInstaModal(true); }}><Plus size={14} /> إضافة</Button>
            </div>
          </div>
          {instagramData.length === 0 ? (
            <p className="text-sm text-[var(--text-dim)] text-center py-6">لا توجد حسابات Instagram</p>
          ) : (
            <div className="space-y-1">
              {instagramData.map(acc => (
                <div key={acc.id} className="flex items-center justify-between p-3 rounded-[12px] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E4405F] to-[#FFD700] flex items-center justify-center shrink-0">
                      <Camera size={16} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{acc.name}</p>
                      <p className="text-xs text-[var(--text-dim)] truncate">@{acc.username}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteInsta(acc.id)}
                    className="p-1.5 rounded-[8px] text-[var(--text-dim)] hover:text-[var(--danger)] hover:bg-[rgba(229,9,20,0.1)] transition-all opacity-0 group-hover:opacity-100 shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="animate-fade-slide-up" style={{ animationDelay: "0.35s" }}>
        <Card className="admin-welcome-gradient !p-8">
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-3 bg-gradient-to-l from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent">
              مرحباً بك في لوحة التحكم
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
              من هنا يمكنك إدارة جميع جوانب <span className="text-[#00E5FF] font-semibold">SYRIA FOUR</span>:
              الأعضاء، البطولات، الفعاليات، الصور، الفيديو، الطلبات، الدعم، الإشعارات، Instagram، والمزيد.
              كل ما تحتاجه لإدارة الكلان في مكان واحد.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-[11px] text-[#6B7280]">النظام يعمل بكامل طاقته — {stats.members || 0} عضو، {stats.tournaments || 0} بطولة</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Instagram Add Modal */}
      <Modal open={instaModal} onClose={() => setInstaModal(false)} title="إضافة حساب Instagram">
        <div className="space-y-4 px-1">
          <FormInput label="الاسم" value={instaForm.name || ""} onChange={e => setInstaForm({ ...instaForm, name: e.target.value })} />
          <FormInput label="اسم المستخدم" value={instaForm.username || ""} onChange={e => setInstaForm({ ...instaForm, username: e.target.value })} />
          <Button onClick={addInsta} className="w-full">إضافة</Button>
        </div>
      </Modal>
    </div>
  );
}
