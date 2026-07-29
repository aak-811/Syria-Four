"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { Eye, ShoppingBag, User, Hash, Phone, MessageSquare, CalendarDays, CreditCard, X } from "lucide-react";

const statusColors: Record<string, "success" | "warning" | "danger" | "default"> = {
  completed: "success", pending: "warning", cancelled: "danger",
};

export default function AdminOrdersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const load = () => { setLoading(true); api.getOrders().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteOrder(row.id); load(); }
  };

  const columns = [
    { key: "playerName", label: "الاسم" },
    { key: "item", label: "المنتج" },
    { key: "payment", label: "الدفع" },
    { key: "status", label: "الحالة", render: (v: string) => <Badge variant={statusColors[v] || "default"}>{v || "—"}</Badge> },
    { key: "date", label: "التاريخ", render: (v: string) => v ? new Date(v).toLocaleDateString() : "—" },
    { key: "_view", label: "", render: (_: any, row: any) => (
      <button onClick={() => setSelected(row)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium bg-[rgba(0,229,255,0.1)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.2)] transition-all border-0 cursor-pointer"
      ><Eye size={12} /> عرض</button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">الطلبات</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة طلبات الشحن</p>
      </div>
      {loading ? <Spinner /> : (
        <DataTable columns={columns} data={data} onDelete={remove} />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="تفاصيل الطلب" className="max-w-md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-[14px] bg-[rgba(0,229,255,0.06)] border border-[rgba(0,229,255,0.1)]">
              <div className="w-12 h-12 rounded-full bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
                <ShoppingBag size={22} className="text-[#00E5FF]" />
              </div>
              <div>
                <p className="font-bold text-lg">{selected.playerName || "—"}</p>
                <Badge variant={statusColors[selected.status] || "default"}>{selected.status || "جديد"}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: User, label: "الاسم", value: selected.playerName },
                { icon: Hash, label: "معرف اللعبة", value: selected.playerId || selected.gameId },
                { icon: ShoppingBag, label: "المنتج", value: selected.item || selected.pack },
                { icon: CreditCard, label: "طريقة الدفع", value: selected.payment },
                { icon: Phone, label: "واتساب", value: selected.phone },
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

            {selected.reason && (
              <div className="glass rounded-[12px] p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare size={12} className="text-[#6B7280]" />
                  <p className="text-[10px] text-[#6B7280]">السبب</p>
                </div>
                <p className="text-sm">{selected.reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
