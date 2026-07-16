"use client";

import Card from "@/components/ui/Card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">الإعدادات</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إعدادات النظام</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-[14px] bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
            <Settings size={24} className="text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="font-bold text-lg">SYRIA FOUR</h2>
            <p className="text-sm text-[var(--text-muted)]">الإصدار 2.0.0</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          لوحة التحكم الخاصة بكلان SYRIA FOUR. إدارة الأعضاء، البطولات، الفعاليات، المعرض، والمزيد.
        </p>
      </Card>
    </div>
  );
}
