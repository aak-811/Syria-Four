"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { Shield, AlertTriangle, Users, Swords, Ban, MessageCircle, Star, AlertCircle, Clock, CheckCircle, Camera } from "lucide-react";

const rules = [
  { icon: Users, title: "احترام الأعضاء", desc: "يجب على جميع الأعضاء احترام بعضهم البعض داخل وخارج اللعبة. عدم السب أو التنمر أو التحرش بأي شكل من الأشكال.", color: "#FF6B35" },
  { icon: Swords, title: "المشاركة في البطولات", desc: "الأعضاء ملزمون بالمشاركة في بطولات الكلان عند الطلب. الغياب بدون عذر مقبول يعرضك للفصل.", color: "#E50914" },
  { icon: Ban, title: "عدم الغش", desc: "يمنع منعًا باتًا استخدام أي برامج غش أو تعديلات في اللعبة. أي عضو يتم ضبطه يطرد فورًا من الكلان.", color: "#FFD700" },
  { icon: MessageCircle, title: "الانضباط في الديسكورد", desc: "جميع الأعضاء ملزمون بالانضمام إلى سيرفر ديسكورد الكلان. المشاركة الفعالة مطلوبة للبقاء في الكلان.", color: "#5865F2" },
  { icon: Star, title: "التطور المستمر", desc: "يجب على الأعضاء السعي لتحسين مستواهم في اللعبة. المشاركة في التدريبات الجماعية والتحديات الداخلية.", color: "#00E676" },
  { icon: AlertTriangle, title: "الالتزام بالقوانين", desc: "الالتزام بقوانين اللعبة الرسمية وسياسات المجتمع. عدم نشر محتوى مسيء أو مخالف للقوانين.", color: "#9CA3AF" },
];

const responseTimes = [
  { label: "طلبات الانضمام", time: "24h", desc: "نراجع طلبات الانضمام خلال 24 ساعة", color: "#00E5FF" },
  { label: "تنسيق البطولات", time: "12h", desc: "نرد على استفسارات البطولات خلال 12 ساعة", color: "#8B5CF6" },
  { label: "استفسارات عامة", time: "6h", desc: "نجيب على الاستفسارات العامة خلال 6 ساعات", color: "#00E676" },
];

const joinSteps = [
  { num: "01", title: "أرسل بياناتك", desc: "أرسل اسمك داخل اللعبة ورتبتك الحالية." },
  { num: "02", title: "حدد مشاركتك", desc: "اذكر نوع مشاركتك المفضلة: رومات، رانكد، أو بطولات." },
  { num: "03", title: "انتظر التفعيل", desc: "انتظر مراجعة القيادة ثم تأكيد إضافتك إلى القائمة المناسبة." },
];

export default function RulesPage() {
  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="animate-fade-slide-up">
          <div className="flex items-center gap-3">
            <Shield size={28} className="text-[#FFD700]" />
            <div>
              <h1 className="text-2xl font-black">القوانين والشروط</h1>
              <p className="text-[#9CA3AF] text-sm mt-1">قوانين وانضباط كلان SYRIA FOUR</p>
            </div>
          </div>
        </div>

        <GlassCard className="p-4 flex items-start gap-3 border-r-4 border-r-[#FFD700]">
          <AlertCircle size={20} className="text-[#FFD700] shrink-0 mt-0.5" />
          <p className="text-sm text-[#9CA3AF]">مخالفة هذه القوانين تؤدي إلى اتخاذ إجراءات تأديبية تصل إلى الفصل النهائي من الكلان.</p>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="animate-fade-slide-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <GlassCard className="group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: r.color }} />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${r.color}22` }}>
                      <Icon size={22} style={{ color: r.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">{r.title}</h3>
                      <p className="text-sm text-[#9CA3AF] leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* أوقات الرد */}
        <div className="animate-fade-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={22} className="text-[#00E5FF]" />
            <div>
              <h2 className="text-lg font-bold">متى يصلك الرد؟</h2>
              <p className="text-xs text-[#9CA3AF]">عادةً تتم مراجعة الرسائل خلال نفس اليوم، مع أولوية للطلبات المرتبطة بالبطولات أو تنسيق الرومات المباشرة.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {responseTimes.map((r, i) => (
              <GlassCard key={i} className="text-center py-6 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <p className="text-3xl font-black" style={{ color: r.color }}>{r.time}</p>
                <p className="text-sm font-bold mt-1">{r.label}</p>
                <p className="text-[10px] text-[#6B7280] mt-1">{r.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* خطوات الانضمام */}
        <div className="animate-fade-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={22} className="text-[#00E676]" />
            <div>
              <h2 className="text-lg font-bold">خطوات الانضمام</h2>
              <p className="text-xs text-[#9CA3AF]">كيف تصبح عضوًا في SYRIA FOUR</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {joinSteps.map((s, i) => (
              <GlassCard key={i} className="text-center py-6 group relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center mx-auto mb-3 text-white font-black text-lg">
                  {s.num}
                </div>
                <h3 className="font-bold text-base">{s.title}</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* أزرار الانضمام */}
        <div className="animate-fade-slide-up">
          <GlassCard className="p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700]" />
            <h2 className="text-lg font-bold mb-4">انضم إلى SYRIA FOUR</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://instagram.com/qusai7r" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[12px] bg-gradient-to-l from-[#E1306C] to-[#833AB4] text-white font-bold text-sm hover:scale-[1.02] transition-all no-underline"
              >
                <Camera size={18} /> @qusai7r
              </a>
              <a href="https://instagram.com/aak.811" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[12px] bg-gradient-to-l from-[#E1306C] to-[#833AB4] text-white font-bold text-sm hover:scale-[1.02] transition-all no-underline"
              >
                <Camera size={18} /> @aak.811
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </PublicLayout>
  );
}
