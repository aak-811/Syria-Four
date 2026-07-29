"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Eye, ClipboardList, User, Hash, MessageSquare, CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminRequestsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const load = () => { setLoading(true); api.getRequests().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteRequest(row.id); load(); }
  };

  const columns = [
    { key: "playerName", label: "الاسم" },
    { key: "playerGameId", label: "معرف اللعبة" },
    { key: "reason", label: "السبب", render: (v: string) => v?.length > 40 ? v.slice(0, 40) + "..." : v || "—" },
    { key: "status", label: "الحالة", render: (v: string) => <Badge variant={v === "approved" ? "success" : v === "rejected" ? "danger" : "warning"}>{v || "جديد"}</Badge> },
    { key: "_view", label: "", render: (_: any, row: any) => (
      <button onClick={() => setSelected(row)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium bg-[rgba(0,229,255,0.1)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.2)] transition-all border-0 cursor-pointer"
      ><Eye size={12} /> عرض</button>
    )},
  ];

  const statusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle size={16} className="text-[#00E676]" />;
    if (status === "rejected") return <XCircle size={16} className="text-[#FF3B30]" />;
    return <Clock size={16} className="text-[#FFD700]" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">طلبات الانضمام</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة طلبات الانضمام</p>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="" className="max-w-md">
        {selected && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                <ClipboardList size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">{selected.playerName || selected.name || "—"}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                {statusIcon(selected.status)}
                <Badge variant={selected.status === "approved" ? "success" : selected.status === "rejected" ? "danger" : "warning"}>
                  {selected.status === "approved" ? "مقبول" : selected.status === "rejected" ? "مرفوض" : selected.status || "قيد الانتظار"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: User, label: "الاسم", value: selected.playerName || selected.name },
                { icon: Hash, label: "معرف اللعبة", value: selected.playerGameId || selected.gameId },
                { icon: MessageSquare, label: "السبب", value: selected.reason },
                { icon: CalendarDays, label: "التاريخ", value: selected.date ? new Date(selected.date).toLocaleDateString() : "—" },
              ].map((f, i) => f.value ? (
                <div key={i} className="glass rounded-[14px] p-4 transition-all hover:bg-[rgba(255,255,255,0.04)]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `rgba(0,229,255,0.1)` }}>
                      <f.icon size={14} className="text-[#00E5FF]" />
                    </div>
                    <p className="text-[10px] text-[#6B7280] font-medium">{f.label}</p>
                  </div>
                  <p className="text-sm font-semibold pr-9">{f.value}</p>
                </div>
              ) : null)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
