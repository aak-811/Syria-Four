"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import {
  Users, Swords, Trophy, Eye,
  Zap, Sparkles, Bell,
  Image as ImageIcon, FileVideo
} from "lucide-react";

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="space-y-10">

        {/* Hero Banner */}
        <div className="fade-in text-center py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.06)] via-transparent to-[rgba(139,92,246,0.04)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[rgba(0,229,255,0.03)] blur-[100px] pointer-events-none" />

          <div className="fade-in w-32 h-32 rounded-2xl mx-auto mb-6 shadow-[0_0_60px_rgba(0,229,255,0.3)] relative overflow-hidden"
            style={{ animationDelay: "0.2s" }}>
            <img src="/images/clan-logo.png" alt="SYRIA FOUR" className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.classList.add('bg-gradient-to-br', 'from-[#00E5FF]', 'to-[#8B5CF6]');
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-black text-4xl tracking-tighter">S4</span>';
              }}
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg shadow-[rgba(139,92,246,0.4)]">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>

          <h1 className="fade-in text-4xl md:text-6xl font-black mb-3 bg-gradient-to-l from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent"
            style={{ animationDelay: "0.4s" }}>
            SYRIA FOUR
          </h1>
          <p className="fade-in text-[#9CA3AF] text-lg md:text-xl" style={{ animationDelay: "0.6s" }}>
            كلان فري فاير - القمة تبدأ من هنا
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: <Users size={24} />, value: 120, label: "الأعضاء", suffix: "+", delay: 0, color: "#00E5FF", desc: "إجمالي أعضاء الكلان" },
            { icon: <Swords size={24} />, value: 15, label: "البطولات", suffix: "+", delay: 0.1, color: "#8B5CF6", desc: "بطولة خاضها الكلان" },
            { icon: <Trophy size={24} />, value: 380, label: "الانتصارات", suffix: "+", delay: 0.2, color: "#FFD700", desc: "فوز في مختلف البطولات" },
            { icon: <Eye size={24} />, value: 40, label: "المشاهدات", suffix: "K+", delay: 0.3, color: "#00E676", desc: "مشاهدة على المنصات" },
          ].map((s, i) => (
            <div key={s.label} className="fade-in relative group" style={{ animationDelay: `${s.delay}s` }}>
              <div className="absolute -inset-0.5 rounded-[20px] bg-gradient-to-b from-[rgba(0,229,255,0.1)] to-[rgba(139,92,246,0.05)] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
              <GlassCard className="text-center py-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
                  style={{ backgroundColor: `${s.color}15` }}
                >
                  <div style={{ color: s.color }}>{s.icon}</div>
                </div>
                <p className="text-3xl md:text-4xl font-black tabular-nums text-white">
                  <AnimatedCounter to={s.value} suffix={s.suffix} duration={2} />
                </p>
                <p className="text-sm font-bold mt-1" style={{ color: s.color }}>{s.label}</p>
                <p className="text-[10px] text-[#6B7280] mt-1">{s.desc}</p>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
              <Zap size={20} className="text-[#00E5FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">إحصائيات الكلان</h2>
              <p className="text-xs text-[#9CA3AF]">أرقام وإنجازات SYRIA FOUR</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "الأعضاء", value: 125, icon: <Users size={20} />, color: "#00E5FF", desc: "عضو نشط" },
              { label: "الأخبار", value: 42, icon: <Bell size={20} />, color: "#8B5CF6", desc: "خبر منشور" },
              { label: "الصور", value: 810, icon: <ImageIcon size={20} />, color: "#00E676", desc: "صورة في المعرض" },
              { label: "الفيديو", value: 77, icon: <FileVideo size={20} />, color: "#FFD700", desc: "مقطع فيديو" },
            ].map((s, i) => (
              <div key={s.label} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <GlassCard className="text-center py-5 group relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                    style={{ backgroundColor: `${s.color}15` }}>
                    <span style={{ color: s.color }}>{s.icon}</span>
                  </div>
                  <p className="text-2xl font-black tabular-nums text-white">
                    <AnimatedCounter to={s.value} duration={1.5} />
                  </p>
                  <p className="text-[12px] font-bold mt-0.5" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[10px] text-[#6B7280]">{s.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
