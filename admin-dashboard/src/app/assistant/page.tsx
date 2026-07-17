"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import GlassCard from "@/components/ui/GlassCard";
import { Bot, Send, Sparkles, Users, Swords, Trophy, Shield, HelpCircle, MessageSquare, Star, ChevronLeft, Diamond, Medal, Crown, ShoppingBag, MapPin, Camera, Gamepad2 } from "lucide-react";

const suggestions = [
  { icon: Users, text: "كيف أنضم إلى الكلان؟", color: "#00E5FF", category: "عضوية" },
  { icon: Shield, text: "ما هي قوانين الكلان؟", color: "#8B5CF6", category: "قوانين" },
  { icon: Star, text: "ما هي مزايا VIP؟", color: "#FFD700", category: "VIP" },
  { icon: Swords, text: "ما هي شروط البطولات؟", color: "#FF3B30", category: "بطولات" },
  { icon: Trophy, text: "كيف أربح الجوائز؟", color: "#FFD700", category: "جوائز" },
  { icon: Crown, text: "من هم قادة الكلان؟", color: "#00E5FF", category: "قيادة" },
  { icon: Trophy, text: "ما هي البطولات القادمة؟", color: "#8B5CF6", category: "بطولات" },
  { icon: Medal, text: "ما هي الأوسمة النادرة؟", color: "#FFD700", category: "أوسمة" },
  { icon: Diamond, text: "كيف أشحن جواهر؟", color: "#00E5FF", category: "شحن" },
  { icon: ShoppingBag, text: "ماذا يوجد في المتجر؟", color: "#00E676", category: "متجر" },
  { icon: Gamepad2, text: "ما هو أسلوب لعب الكلان؟", color: "#FF6B35", category: "لعب" },
  { icon: HelpCircle, text: "كيف أتواصل مع الإدارة؟", color: "#00E676", category: "دعم" },
  { icon: MapPin, text: "من أين أعضاء الكلان؟", color: "#8B5CF6", category: "أعضاء" },
  { icon: Camera, text: "أين أجد مقاطع الفيديو؟", color: "#E1306C", category: "ميديا" },
  { icon: Users, text: "كيف أصبح قائداً؟", color: "#FFD700", category: "قيادة" },
  { icon: Shield, text: "ما هي عقوبات المخالفات؟", color: "#FF3B30", category: "قوانين" },
];

const answers: Record<string, string> = {
  "كيف أنضم إلى الكلان؟": "للانضمام إلى SYRIA FOUR:\n\n1. تواصل مع أحد القادة عبر إنستغرام:\n   • @aak.811 (AAK Khalid)\n   • @qusai7r (Qusai)\n\n2. أو اتبع خطوات الانضمام في صفحة الشروط.\n\n3. سيتم تقييم مستواك في اللعبة.\n\n4. بعد الموافقة، ستحصل على الرتبة المناسبة.",
  
  "ما هي قوانين الكلان؟": "قوانين SYRIA FOUR:\n\n• احترام جميع الأعضاء دون استثناء\n• المشاركة في البطولات عند الطلب\n• عدم استخدام برامج الغش أو التلاعب\n• الانضباط في السيرفرات الرسمية\n• التطور المستمر والتدريب\n• الالتزام بمواعيد المباريات\n• تمثيل الكلان بأخلاق عالية",
  
  "ما هي مزايا VIP؟": "مزايا عضوية VIP:\n\n• إطار ذهبي حول صورة العضو\n• شارة VIP خاصة بجانب الاسم\n• مزايا حصرية في البطولات\n• أولوية الدعم الفني\n• خصومات على الشحن\n• دخول فعاليات حصرية\n\nللاشتراك تواصل مع الإدارة عبر إنستغرام.",
  
  "ما هي شروط البطولات؟": "شروط البطولات:\n\n• الالتزام بمواعيد المباريات\n• الحضور قبل المباراة بـ 10 دقائق\n• استخدام اللاعب الأساسي فقط\n• احترام الخصم والحكام\n• ارتداء شعار الكلان\n• التسجيل قبل الموعد النهائي\n• الالتزام بقوانين اللعبة",
  
  "كيف أربح الجوائز؟": "يمكنك ربح الجوائز من خلال:\n\n• الفوز في البطولات الداخلية\n• المشاركة الفعالة في الحروب\n• تحقيق إنجازات في الرانكد (Heroic فأعلى)\n• دعم الكلان مادياً\n• الفوز في المسابقات الأسبوعية\n• تحقيق أعلى نسبة فوز في الشهر",
  
  "من هم قادة الكلان؟": "قيادة SYRIA FOUR:\n\n• AAK Khalid - مؤسس وقائد الكلان (Instagram: @aak.811)\n• Qusai - شريك القائد (Instagram: @qusai7r)\n• Za3im - زعيم الكلان\n• Lorans - الدعم الفني (Instagram: @Lorans_83)",
  
  "ما هي البطولات القادمة؟": "تابع صفحة البطولات في الموقع لمعرفة أحدث البطولات القادمة والجارية.\n\nيتم الإعلان عن البطولات عبر:\n• صفحة البطولات هنا\n• إنستغرام الكلان\n• الإشعارات في الموقع",
  
  "ما هي الأوسمة النادرة؟": "الأوسمة النادرة في SYRIA FOUR:\n\n• مؤسس الكلان - AAK Khalid\n• أقوى لاعب حروب - Qusai\n• أقوى لاعب بطولات - Za3im\n• داعم الكلان - Sniper\n\nيتم منح الأوسمة بناءً على الإنجازات والمساهمات.",
  
  "كيف أشحن جواهر؟": "لشحن جواهر فري فاير:\n\n1. اذهب إلى صفحة الشحن في الموقع\n2. اختر الباقة المناسبة لك\n3. اضغط على الباقة ثم اختر 'طلب الشراء'\n4. املأ النموذج (الاسم، UID، واتساب)\n5. سيتم التواصل معك لتأكيد الطلب\n\nجميع عمليات الشحن آمنة ومضمونة.",
  
  "ماذا يوجد في المتجر؟": "المتجر يحتوي على:\n\n💎 باقات شحن جواهر فري فاير (70 حتى 4000 ديموند)\n🎫 بطاقات الموسم الحالي\n👑 عضوية VIP\n🎮 حسابات فري فاير مميزة\n\nتصفح المتجر واختر ما يناسبك!",
  
  "ما هو أسلوب لعب الكلان؟": "SYRIA FOUR يعتمد على:\n\n• اللعب الجماعي والتنسيق\n• استراتيجيات هجومية ودفاعية متقدمة\n• التدريب المستمر على الخرائط\n• تحليل أداء الخصوم\n• استخدام أحدث التكتيكات في اللعبة\n\nنركز على التطوير المستمر لمهارات الأعضاء.",
  
  "كيف أتواصل مع الإدارة؟": "يمكنك التواصل مع الإدارة عبر:\n\n• صفحة الدعم الفني في الموقع (إرسال تذكرة)\n• إنستغرام:\n  - @aak.811 (AAK Khalid)\n  - @qusai7r (Qusai)\n  - @Lorans_83 (الدعم الفني)\n• واتساب: +963 934 946 251\n• قسم المساعدة في الموقع",
  
  "من أين أعضاء الكلان؟": "معظم أعضاء SYRIA FOUR من:\n\n🇸🇾 سوريا - الغالبية العظمى\n🇪🇬 مصر\n🇦🇪 الإمارات\n🇸🇦 السعودية\n\nالكلان يضم أعضاء من جميع أنحاء الوطن العربي!",
  
  "أين أجد مقاطع الفيديو؟": "مقاطع الفيديو متاحة في:\n\n• صفحة المعرض في الموقع (تبويب فيديوهات)\n• يمكنك رؤية أبرز اللقطات واللحظات.\n• يتم إضافة مقاطع جديدة باستمرار.",
  
  "كيف أصبح قائداً؟": "لكي تصبح قائداً في SYRIA FOUR:\n\n• أظهر التزامك وتفانيك للكلان\n• شارك بفعالية في جميع البطولات\n• ساعد الأعضاء الجدد\n• كن قدوة في السلوك والأخلاق\n• حقق إنجازات مميزة في اللعبة\n• الترقية تكون بقرار من الإدارة فقط",
  
  "ما هي عقوبات المخالفات؟": "عقوبات المخالفات:\n\n• المخالفة الأولى: إنذار شفوي\n• المخالفة الثانية: إنذار كتابي\n• المخالفة الثالثة: إيقاف مؤقت (3 أيام - أسبوع)\n• المخالفات الجسيمة: فصل نهائي\n• الغش: فصل فوري بدون إنذار\n• الإساءة: حسب تقدير الإدارة",
};

const categories = [...new Set(suggestions.map(s => s.category))];

export default function AssistantPage() {
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const handleSelect = (q: string) => {
    setSelectedQ(q);
    setShowAnswer(true);
  };

  const handleReset = () => {
    setSelectedQ(null);
    setShowAnswer(false);
  };

  const filtered = activeCat ? suggestions.filter(s => s.category === activeCat) : suggestions;

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,229,255,0.2)]">
            <Bot size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-black mb-1">مساعد Syria Four الذكي</h1>
          <p className="text-[#9CA3AF] text-sm">أداة ذكاء اصطناعي للإجابة عن استفساراتك - {suggestions.length} سؤال</p>
        </div>

        <GlassCard className="p-6">
          {!showAnswer ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-[#00E5FF]" />
                <p className="text-sm text-[#9CA3AF]">اختر أحد الاقتراحات التالية:</p>
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setActiveCat(null)}
                  className={`px-3 py-1.5 rounded-[10px] text-[11px] font-semibold transition-all border-0 cursor-pointer ${!activeCat ? "bg-[#00E5FF] text-[#050816]" : "glass text-[#9CA3AF] hover:text-white"}`}
                >الكل</button>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCat(cat)}
                    className={`px-3 py-1.5 rounded-[10px] text-[11px] font-semibold transition-all border-0 cursor-pointer ${activeCat === cat ? "bg-[#00E5FF] text-[#050816]" : "glass text-[#9CA3AF] hover:text-white"}`}
                  >{cat}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filtered.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button key={i} onClick={() => handleSelect(s.text)}
                      className="flex items-center gap-3 p-3 rounded-[12px] text-right transition-all duration-300 hover:scale-[1.02] group border-0 cursor-pointer w-full"
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
              <button onClick={handleReset} className="flex items-center gap-1 text-sm text-[#00E5FF] hover:underline border-0 bg-transparent cursor-pointer">
                <ChevronLeft size={16} /> العودة للأسئلة
              </button>
              <div className="flex items-start gap-3 p-4 rounded-[14px] bg-[rgba(0,229,255,0.06)]">
                <div className="w-10 h-10 rounded-full bg-[rgba(0,229,255,0.1)] flex items-center justify-center shrink-0">
                  <Bot size={20} className="text-[#00E5FF]" />
                </div>
                <div className="flex-1 min-w-0">
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
