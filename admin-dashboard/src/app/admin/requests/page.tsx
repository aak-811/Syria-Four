"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";

export default function AdminRequestsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">طلبات الانضمام</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة طلبات الانضمام</p>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}
    </div>
  );
}
