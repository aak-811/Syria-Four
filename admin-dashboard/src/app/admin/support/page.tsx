"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Eye, MessageSquare, User, Hash, CalendarDays, Mail, X } from "lucide-react";

export default function AdminSupportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const load = () => { setLoading(true); api.getSupport().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteSupport(row.id); load(); }
  };

  const columns = [
    { key: "playerName", label: "الاسم" },
    { key: "type", label: "النوع" },
    { key: "message", label: "الرسالة", render: (v: string) => v?.length > 50 ? v.slice(0, 50) + "..." : v || "—" },
    { key: "status", label: "الحالة", render: (v: string) => <Badge variant={v === "read" ? "success" : "warning"}>{v || "جديد"}</Badge> },
    { key: "date", label: "التاريخ", render: (v: string) => v ? new Date(v).toLocaleDateString() : "—" },
    { key: "_view", label: "", render: (_: any, row: any) => (
      <button onClick={() => { setSelected(row); }}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium bg-[rgba(0,229,255,0.1)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.2)] transition-all border-0 cursor-pointer"
      ><Eye size={12} /> عرض</button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">الدعم الفني</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة تذاكر الدعم</p>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="تفاصيل التذكرة" className="max-w-md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-[14px] bg-[rgba(37,211,102,0.06)] border border-[rgba(37,211,102,0.1)]">
              <div className="w-12 h-12 rounded-full bg-[rgba(37,211,102,0.1)] flex items-center justify-center">
                <MessageSquare size={22} className="text-[#25D366]" />
              </div>
              <div>
                <p className="font-bold text-lg">{selected.playerName || selected.name || "—"}</p>
                <Badge variant={selected.status === "read" ? "success" : "warning"}>{selected.status || "جديد"}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: User, label: "الاسم", value: selected.playerName || selected.name },
                { icon: Hash, label: "معرف اللعبة", value: selected.playerId || selected.gameId },
                { icon: Mail, label: "النوع", value: selected.type },
                { icon: CalendarDays, label: "التاريخ", value: selected.date ? new Date(selected.date).toLocaleDateString() : "—" },
              ].map((f, i) => f.value ? (
                <div key={i} className="glass rounded-[12px] p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <f.icon size={12} className="text-[#6B7280]" />
                    <p className="text-[10px] text-[#6B7280]">{f.label}</p>
                  </div>
                  <p className="text-sm font-semibold">{f.value}</p>
                </div>
              ) : null)}
            </div>

            {selected.message && (
              <div className="glass rounded-[12px] p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare size={12} className="text-[#6B7280]" />
                  <p className="text-[10px] text-[#6B7280]">الرسالة</p>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
