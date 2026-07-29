"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import { api } from "@/lib/api";
import { Plus, MessageCircle, Crown, Sparkles, Star, MapPin, X, Search } from "lucide-react";

const locations = [
  // Syria cities & towns
  "دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "الحسكة", "الرقة", "دير الزور", "إدلب", "درعا", "السويداء", "القنيطرة",
  "ريف دمشق", "دوما", "حرستا", "جرمانا", "داريا", "قطنا", "الزبداني", "يبرود", "النبك", "التل", "سرغايا",
  "منبج", "الباب", "عفرين", "السفيرة", "عزاز", "جبل سمعان", "اعزاز",
  "تدمر", "المخرم", "القصير", "الرستن", "تلبيسة", "كفرلاها",
  "سلمية", "مصياف", "محردة", "السقيلبية", "كفرزيتا", "طيبة الإمام",
  "جبلة", "القرداحة", "الحفة", "بانياس",
  "صافيتا", "بانياس", "الشيخ بدر", "الدريكيش",
  "القامشلي", "المالكية", "عامودا", "رأس العين", "تل حميس",
  "الطبقة", "منصور", "الثورة",
  "الميادين", "البوكمال", "القورية",
  "معرة النعمان", "جسر الشغور", "أريحا", "حارم", "سرمدا",
  "ازرع", "نوى", "الحراك", "جاسم", "إنخل", "الشيخ مسكين",
  "شهبا", "صلخد",
  // Country names
  "سوريا", "السعودية", "الإمارات", "مصر", "العراق", "الأردن", "لبنان", "فلسطين", "قطر", "البحرين", "الكويت", "عمان", "اليمن",
  // Country codes
  "SY", "SA", "AE", "EG", "IQ", "JO", "LB", "PS", "QA", "BH", "KW", "OM", "YE",
];

const roles = [
  { value: "leader", label: "زعيم" },
  { value: "chief", label: "قائد" },
  { value: "vice", label: "شريك قائد" },
  { value: "elite", label: "نخبة" },
  { value: "member", label: "عضو" },
];

const playStyles = [
  { value: "رومات", label: "رومات" },
  { value: "رانكد", label: "رانكد" },
  { value: "بطولات", label: "بطولات" },
];

export default function AdminMembersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [showLocations, setShowLocations] = useState(false);
  const locRef = useRef<HTMLDivElement>(null);

  const load = () => { setLoading(true); api.getMembers().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocations(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    try {
      if (edit) await api.updateMember(edit.id, form);
      else await api.addMember(form);
      setModal(false); load();
    } catch (err: any) {
      alert("خطأ: " + (err.message || "فشل الحفظ"));
    }
  };

  const remove = async (row: any) => {
    if (confirm("هل أنت متأكد؟")) { await api.deleteMember(row.id); load(); }
  };

  const filteredLocations = form.country?.length > 0
    ? locations.filter(l => l.includes(form.country) || l.toLowerCase().includes(form.country.toLowerCase())).slice(0, 10)
    : [];

  const columns = [
    { key: "image", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ) : "—" },
    { key: "name", label: "الاسم" },
    { key: "gameId", label: "معرف اللعبة" },
    { key: "role", label: "الدور" },
    { key: "level", label: "المستوى" },
    { key: "wins", label: "الفوز" },
    { key: "country", label: "البلد" },
    { key: "chatName", label: "دردشة", render: (v: string) => v ? <span className="text-[var(--primary)] text-xs font-medium">{v}</span> : "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">الأعضاء</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">إدارة أعضاء الكلان</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> إضافة عضو</Button>
      </div>

      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل العضو" : "إضافة عضو"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormFileUpload label="الصورة الشخصية" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" />
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="معرف اللعبة" value={form.gameId || ""} onChange={e => setForm({ ...form, gameId: e.target.value })} />
          <FormInput label="العمر" type="number" value={form.age || ""} onChange={e => setForm({ ...form, age: e.target.value })} />

          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">الدور</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                  className={`px-3 py-2 rounded-[10px] text-xs font-semibold transition-all border-0 cursor-pointer ${
                    form.role === r.value
                      ? "bg-[var(--primary)] text-[#050816]"
                      : "bg-[rgba(255,255,255,0.04)] text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.08)]"
                  }`}
                >{r.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">أسلوب اللعب</label>
            <div className="grid grid-cols-3 gap-2">
              {playStyles.map(ps => (
                <button key={ps.value} type="button" onClick={() => setForm({ ...form, playStyle: ps.value })}
                  className={`px-3 py-2 rounded-[10px] text-xs font-semibold transition-all border-0 cursor-pointer ${
                    form.playStyle === ps.value
                      ? "bg-[#00E676] text-[#050816]"
                      : "bg-[rgba(255,255,255,0.04)] text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.08)]"
                  }`}
                >{ps.label}</button>
              ))}
            </div>
          </div>

          <FormInput label="المستوى" type="number" value={form.level || ""} onChange={e => setForm({ ...form, level: e.target.value })} />
          <FormInput label="الفوز" type="number" value={form.wins || ""} onChange={e => setForm({ ...form, wins: e.target.value })} />

          <div className="relative" ref={locRef}>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
              <MapPin size={14} className="inline ml-1" />البلد / المنطقة
            </label>
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none" />
              <input value={form.country || ""} onChange={e => { setForm({ ...form, country: e.target.value }); setShowLocations(true); }}
                onFocus={() => setShowLocations(true)}
                placeholder="اكتب اسم مدينة، قرية، أو دولة..."
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-[12px] px-4 py-2.5 pr-10 text-sm text-white placeholder-[var(--text-dim)] outline-none focus:border-[var(--primary)] transition-colors"
              />
              {form.country && (
                <button onClick={() => { setForm({ ...form, country: "" }); setShowLocations(false); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors border-0 bg-transparent cursor-pointer"
                ><X size={14} className="text-[var(--text-dim)]" /></button>
              )}
            </div>
            {showLocations && filteredLocations.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-[rgba(5,8,22,0.98)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[14px] p-2 shadow-xl max-h-48 overflow-y-auto">
                {filteredLocations.map(l => (
                  <button key={l} type="button" onClick={() => { setForm({ ...form, country: l }); setShowLocations(false); }}
                    className="w-full text-right px-3 py-2.5 rounded-[10px] text-sm text-[#9CA3AF] hover:bg-[rgba(0,229,255,0.08)] hover:text-white transition-all border-0 cursor-pointer flex items-center gap-2"
                  ><MapPin size={14} className="text-[var(--primary)]" /> {l}</button>
                ))}
              </div>
            )}
            {showLocations && form.country?.length > 0 && filteredLocations.length === 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-[rgba(5,8,22,0.98)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[14px] p-3 shadow-xl">
                <p className="text-sm text-[#6B7280] text-center">لا توجد نتائج - سيتم استخدام "{form.country}" كموقع مخصص</p>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border)] pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#FFD700]" />
              <span className="text-sm font-bold text-[#FFD700]">المميزات</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-[12px] bg-[rgba(255,215,0,0.06)] border border-[rgba(255,215,0,0.15)] cursor-pointer">
                <input type="checkbox" checked={form.goldFrame || false} onChange={e => setForm({ ...form, goldFrame: e.target.checked })} className="w-4 h-4 accent-[#FFD700]" />
                <span className="text-sm font-medium text-[#FFD700]">إطار ذهبي</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-[12px] bg-[rgba(0,229,255,0.06)] border border-[rgba(0,229,255,0.15)] cursor-pointer">
                <input type="checkbox" checked={form.vipBadge || false} onChange={e => setForm({ ...form, vipBadge: e.target.checked })} className="w-4 h-4 accent-[#00E5FF]" />
                <span className="text-sm font-medium text-[#00E5FF]">شارة VIP</span>
              </label>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-[12px] bg-[rgba(255,215,0,0.06)] border border-[rgba(255,215,0,0.15)] cursor-pointer relative overflow-hidden">
              <input type="checkbox" checked={form.isPrime || false} onChange={e => setForm({ ...form, isPrime: e.target.checked })} className="w-4 h-4 accent-[#FFD700]" />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Crown size={18} className="text-[#FFD700]" />
                  {form.isPrime && (
                    <span className="absolute -top-1 -right-1 w-3 h-3">
                      <span className="absolute inset-0 rounded-full bg-[#FFD700] animate-ping opacity-75" />
                      <span className="absolute inset-0 rounded-full bg-[#FFD700]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-sm font-bold bg-gradient-to-l from-[#FFD700] to-[#FF6B35] bg-clip-text text-transparent">أيقونة برايم</span>
                  <p className="text-[10px] text-[var(--text-dim)]">أيقونة ذهبية متحركة تحت الصورة الشخصية</p>
                </div>
              </div>
              {form.isPrime && (
                <span className="mr-auto flex items-center gap-1 text-[10px] text-[#FFD700]">
                  <Star size={10} /> نشط
                </span>
              )}
            </label>

            <FormInput label="لون الاسم (hex)" value={form.nameColor || ""} onChange={e => setForm({ ...form, nameColor: e.target.value })} placeholder="#FFD700" />
            <FormInput label="لون صفحة العضو (hex)" value={form.profileColor || ""} onChange={e => setForm({ ...form, profileColor: e.target.value })} placeholder="#8B5CF6" />
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)]">بيانات الدخول إلى الدردشة</span>
            </div>
            <FormInput label="اسم المستخدم في الدردشة" value={form.chatName || ""} onChange={e => setForm({ ...form, chatName: e.target.value })} placeholder="الاسم الذي يسجل به في الدردشة" />
            <div className="relative mt-3">
              <FormInput label="كلمة سر الدردشة" value={form.chatPassword || ""} onChange={e => setForm({ ...form, chatPassword: e.target.value })} placeholder="كلمة السر للدخول إلى الدردشة" />
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <FormFileUpload label="معرض الصور الشخصية" value={form.galleryImage || ""} onChange={(url) => setForm({ ...form, galleryImage: url })} accept="image/*" />
          </div>

          <FormTextarea label="السيرة" value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}
