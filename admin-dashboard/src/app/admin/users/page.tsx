"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";

const roleColors: Record<string, "danger" | "gold" | "success" | "info" | "default"> = {
  owner: "danger", admin: "gold", member: "success",
};

export default function AdminUsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); api.getUsers().then(r => setData(r.users || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteUser(row.id); load(); }
  };

  const columns = [
    { key: "name", label: "الاسم" },
    { key: "username", label: "اسم المستخدم" },
    { key: "email", label: "البريد" },
    { key: "role", label: "الدور", render: (v: string) => <Badge variant={roleColors[v] || "default"}>{v || "—"}</Badge> },
    { key: "status", label: "الحالة", render: (v: string) => <Badge variant={v === "active" ? "success" : "danger"}>{v || "—"}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">المستخدمين</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">إدارة مستخدمي النظام</p>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onDelete={remove} />}
    </div>
  );
}
