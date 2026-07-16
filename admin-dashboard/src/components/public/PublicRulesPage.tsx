"use client";
import GlassCard from "@/components/ui/GlassCard";
import { Shield, AlertTriangle, Users, Swords, Ban, MessageCircle, Star, AlertCircle } from "lucide-react";

const rules = [
  {
    icon: Users, title: "احترام الأعضاء", desc: "يجب على جميع الأعضاء احترام بعضهم البعض داخل وخارج اللعبة.عدم السب أو التنمر أو التحرش بأي شكل من الأشكال.",
    color: "#FF6B35",
  },
  {
    icon: Swords, title: "المشاركة في البطولات", desc: "الأعضاء ملزمون بالمشاركة في بطولات الكلان عند الطلب.الغياب بدون عذر مقبول يعرضك للفصل.",
    color: "#E50914",
  },
  {
    icon: Ban, title: "عدم الغش", desc: "يمنع منعًا باتًا استخدام أي برامج غش أو تعديلات في اللعبة.أي عضو يتم ضبطه يطرد فورًا من الكلان.",
    color: "#FFD700",
  },
  {
    icon: MessageCircle, title: "الانضباط في الديسكورد", desc: "جميع الأعضاء ملزمون بالانضمام إلى سيرفر ديسكورد الكلان.المشاركة الفعالة مطلوبة للبقاء في الكلان.",
    color: "#5865F2",
  },
  {
    icon: Star, title: "التطور المستمر", desc: "يجب على الأعضاء السعي لتحسين مستواهم في اللعبة.المشاركة في التدريبات الجماعية والتحديات الداخلية.",
    color: "#00E676",
  },
  {
    icon: AlertTriangle, title: "الالتزام بالقوانين", desc: "الالتزام بقوانين اللعبة الرسمية وسياسات المجتمع.عدم نشر محتوى مسيء أو مخالف للقوانين.",
    color: "#9CA3AF",
  },
];

export default function PublicRulesPage() {
  return (
    <div className="space-y-6">
      <div className="fade-in">
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
            <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
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
    </div>
  );
}
