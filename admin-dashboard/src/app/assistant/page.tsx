"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { Bot, Send, Sparkles, Users, Swords, Trophy, Shield, HelpCircle, MessageSquare, Star, ChevronLeft } from "lucide-react";

const suggestions = [
  { icon: Users, text: "كيف أنضم إلى الكلان؟", color: "#00E5FF" },
  { icon: Swords, text: "ما هي شروط البطولات؟", color: "#FF3B30" },
  { icon: Trophy, text: "كيف أربح الجوائز؟", color: "#FFD700" },
  { icon: Shield, text: "ما هي قوانين الكلان؟", color: "#8B5CF6" },
  { icon: Star, text: "ما هي مزايا VIP؟", color: "#FFD700" },
  { icon: HelpCircle, text: "كيف أتواصل مع الإدارة؟", color: "#00E676" },
  { icon: Users, text: "من هم قادة الكلان؟", color: "#00E5FF" },
  { icon: Trophy, text: "ما هي البطولات القادمة؟", color: "#8B5CF6" },
];

const answers: Record<string, string> = {
  "كيف أنضم إلى الكلان؟": "للانضمام إلى SYRIA FOUR، تواصل مع أحد القادة عبر إنستغرام:\n• qusai7r\n• aak.811\nأو اتبع خطوات الانضمام في صفحة الشروط.",
  "ما هي شروط البطولات؟": "شروط البطولات تشمل:\n• الالتزام بمواعيد المباريات\n• الحضور قبل المباراة بـ 10 دقائق\n• استخدام اللاعب الأساسي فقط\n• احترام الخصم والحكام",
  "كيف أربح الجوائز؟": "يمكنك ربح الجوائز من خلال:\n• الفوز في البطولات الداخلية\n• المشاركة الفعالة في الحروب\n• تحقيق إنجازات في الرانكد\n• دعم الكلان مادياً",
  "ما هي قوانين الكلان؟": "قوانين SYRIA FOUR:\n• احترام جميع الأعضاء\n• المشاركة في البطولات عند الطلب\n• عدم استخدام برامج الغش\n• الانضباط في الديسكورد\n• التطور المستمر",
  "ما هي مزايا VIP؟": "مزايا عضوية VIP:\n• إطار ذهبي للاسم\n• شارة VIP خاصة\n• مزايا حصرية\n• أولوية الدعم الفني\nللاشتراك تواصل مع الإدارة.",
  "كيف أتواصل مع الإدارة؟": "يمكنك التواصل مع الإدارة عبر:\n• صفحة الدعم في الموقع\n• إنستغرام: qusai7r أو aak.811\n• قسم المساعدة في الموقع",
  "من هم قادة الكلان؟": "قيادة SYRIA FOUR:\n• AAK Khalid - مؤسس وقائد الكلان\n• Qusai - شريك القائد\n• Za3im - زعيم الكلان",
  "ما هي البطولات القادمة؟": "تابع صفحة البطولات في الموقع لمعرفة أحدث البطولات القادمة والجارية. يتم الإعلان عن البطولات عبر القنوات الرسمية.",
};

export default function AssistantPage() {
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelect = (q: string) => {
    setSelectedQ(q);
    setShowAnswer(true);
  };

  const handleReset = () => {
    setSelectedQ(null);
    setShowAnswer(false);
  };

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,229,255,0.2)]">
            <Bot size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-black mb-1">مساعد Syria Four الذكي</h1>
          <p className="text-[#9CA3AF] text-sm">أداة ذكاء اصطناعي للإجابة عن استفساراتك</p>
        </div>

        <GlassCard className="p-6">
          {!showAnswer ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-[#00E5FF]" />
                <p className="text-sm text-[#9CA3AF]">اختر أحد الاقتراحات التالية:</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button key={i} onClick={() => handleSelect(s.text)}
                      className="flex items-center gap-3 p-3 rounded-[12px] text-right transition-all duration-300 hover:scale-[1.02] group"
                      style={{ backgroundColor: `${s.color}08` }}
                    >
                      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${s.color}15` }}>
                        <Icon size={18} style={{ color: s.color }} />
                      </div>
                      <span className="text-sm font-medium">{s.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={handleReset} className="flex items-center gap-1 text-sm text-[#00E5FF] hover:underline">
                <ChevronLeft size={16} /> العودة للأسئلة
              </button>
              <div className="flex items-start gap-3 p-4 rounded-[14px] bg-[rgba(0,229,255,0.06)]">
                <div className="w-10 h-10 rounded-full bg-[rgba(0,229,255,0.1)] flex items-center justify-center shrink-0">
                  <Bot size={20} className="text-[#00E5FF]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#00E5FF] mb-2">{selectedQ}</p>
                  <div className="text-sm text-[#9CA3AF] leading-relaxed whitespace-pre-line">
                    {selectedQ ? answers[selectedQ] || "شكراً لسؤالك! يرجى التواصل مع الإدارة للحصول على إجابة مفصلة." : ""}
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </PublicLayout>
  );
}
