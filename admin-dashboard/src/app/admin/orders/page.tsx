"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";

const statusColors: Record<string, "success" | "warning" | "danger" | "default"> = {
  completed: "success", pending: "warning", cancelled: "danger",
};

export default function AdminOrdersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">الطلبات</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة طلبات الشحن</p>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}
    </div>
  );
}
