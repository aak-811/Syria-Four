"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { api } from "@/lib/api";

export default function AdminAuditPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); api.getAuditLogs().then(r => setData(r.logs || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const columns = [
    { key: "action", label: "الإجراء" },
    { key: "details", label: "التفاصيل", render: (v: string) => v?.length > 60 ? v.slice(0, 60) + "..." : v || "—" },
    { key: "ip", label: "IP" },
    { key: "createdAt", label: "التاريخ", render: (v: string) => v ? new Date(v).toLocaleDateString() : "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">سجل النشاط</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">سجل جميع الإجراءات في النظام</p>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}
