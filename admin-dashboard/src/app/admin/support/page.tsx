"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";

export default function AdminSupportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">الدعم الفني</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة تذاكر الدعم</p>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}
    </div>
  );
}
