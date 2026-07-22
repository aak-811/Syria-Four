"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { FormInput } from "@/components/admin/FormField";
import { api } from "@/lib/api";
import { Plus, Trophy } from "lucide-react";

export default function AdminLeaderboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); api.getLeaderboard().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    try {
      if (edit) await api.updateLeaderboardEntry(edit.id, form);
      else await api.addLeaderboardEntry(form);
      setModal(false); load();
    } catch (err: any) {
      alert("خطأ: " + (err.message || "فشل الحفظ"));
    }
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد من حذف اللاعب من الترتيب؟")) { await api.deleteLeaderboardEntry(row.id); load(); }
  };

  const columns = [
    { key: "name", label: "اللاعب" },
    { key: "glory", label: "جلوري", render: (v: number) => <span className="text-[#FFD700] font-bold">{v ?? 0}</span> },
    { key: "wars", label: "حروب رابطة", render: (v: number) => <span className="text-[#00E5FF] font-bold">{v ?? 0}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">ترتيب اللاعبين</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة ترتيب اللاعبين (جلوري + حروب رابطة)</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة لاعب</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل اللاعب" : "إضافة لاعب"}>
        <div className="space-y-4 px-1">
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="جلوري" type="number" value={form.glory ?? ""} onChange={e => setForm({ ...form, glory: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <FormInput label="حروب رابطة" type="number" value={form.wars ?? ""} onChange={e => setForm({ ...form, wars: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
