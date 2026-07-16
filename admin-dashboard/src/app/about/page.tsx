"use client";

import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Card from "@/components/ui/Card";
import { Target, Shield, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <PublicNavbar />
      <main className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
          <div>
            <h1 className="text-2xl font-black">من نحن</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">نبذة عن كلان SYRIA FOUR</p>
          </div>

          <Card glow>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
                  <Zap size={24} className="text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">SYRIA FOUR</h2>
                  <p className="text-sm text-[var(--text-muted)]">كلان فري فاير سوري</p>
                </div>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                SYRIA FOUR هو كلان فري فاير سوري يضم نخبة من اللاعبين المحترفين.
                نشارك في البطولات المحلية والعالمية، ونسعى دائمًا لتحقيق الانتصارات
                ورفع اسم سوريا عاليًا في عالم الألعاب الإلكترونية.
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center shrink-0">
                  <Target size={22} className="text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">رؤيتنا</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    نطمح أن نكون أفضل كلان فري فاير في سوريا والمنطقة العربية،
                    من خلال التدريب المستمر والمشاركة في البطولات الكبرى.
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-[rgba(139,92,246,0.1)] flex items-center justify-center shrink-0">
                  <Shield size={22} className="text-[var(--secondary)]" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">قيمنا</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    الانضباط، الاحترام، والعمل الجماعي هم أساس نجاحنا.
                    نؤمن بأن الفريق القوي يبني أفرادًا أقوياء.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Users size={20} className="text-[var(--primary)] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">انضم إلينا</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  إذا كنت لاعب فري فاير محترفًا وتبحث عن كلان منظم ومنافس،
                  فنحن نرحب بك في SYRIA FOUR. تواصل معنا عبر صفحة الاتصال.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
