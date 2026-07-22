"use client";

import { useState, useEffect } from "react";
import { chatApi } from "@/lib/chat-api";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/admin/DataTable";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import FormFileUpload from "@/components/admin/FormFileUpload";
import {
  MessageCircle, Users, MessageSquare, Settings as SettingsIcon,
  RefreshCw, Trash2, Plus, Palette, Save
} from "lucide-react";

type Tab = "members" | "conversations" | "messages" | "settings";

const tabs: { key: Tab; label: string; icon: any }[] = [
  { key: "members", label: "المتواجدون", icon: Users },
  { key: "conversations", label: "المحادثات", icon: MessageCircle },
  { key: "messages", label: "الرسائل", icon: MessageSquare },
  { key: "settings", label: "الإعدادات", icon: SettingsIcon },
];

export default function AdminChatPage() {
  const [tab, setTab] = useState<Tab>("members");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black gradient-text">إدارة الدردشة</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">تحكم كامل في نظام المحادثات</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-[16px] overflow-x-auto">
        {tabs.map(t => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-all shrink-0 ${active ? "bg-[var(--primary)] text-black shadow-lg shadow-[rgba(0,229,255,0.2)]" : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]"}`}>
              <t.icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "members" && <MembersTab />}
      {tab === "conversations" && <ConversationsTab />}
      {tab === "messages" && <MessagesTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}

// ===================== Members Tab =====================
function MembersTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => {
    setLoading(true);
    api.getMembers().then(all => {
      setData(all.filter(m => m.chatName && m.chatPassword));
    }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({}); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    try {
      if (edit) await api.updateMember(edit.id, form);
      else await api.addMember(form);
      setModal(false); load();
    } catch (err: any) { alert("خطأ: " + (err.message || "فشل الحفظ")); }
  };

  const remove = async (row: any) => {
    if (!confirm("هل أنت متأكد من حذف العضو؟")) return;
    try { await api.deleteMember(row.id); load(); }
    catch (err: any) { alert("خطأ: " + (err.message || "فشل الحذف")); }
  };

  const columns = [
    { key: "image", label: "الصورة", render: (v: string) => v ? (
      <img src={v} alt="" className="w-10 h-10 rounded-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = "none"} />
    ) : "—" },
    { key: "name", label: "الاسم" },
    { key: "chatName", label: "اسم الدردشة", render: (v: string) => v ? <span className="text-[var(--primary)] text-xs font-medium">{v}</span> : "—" },
    { key: "chatPassword", label: "كلمة السر", render: (v: string) => v ? "••••••" : "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">إدارة أعضاء الكلان — {data.length} عضو</p>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-[10px] glass hover:bg-[var(--surface-hover)] transition-colors" title="تحديث"><RefreshCw size={15} /></button>
          <Button onClick={openAdd}><Plus size={16} /> إضافة عضو</Button>
        </div>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل العضو" : "إضافة عضو"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormFileUpload label="الصورة الشخصية" value={form.image || ""} onChange={url => setForm({ ...form, image: url })} accept="image/*" />
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="معرف اللعبة" value={form.gameId || ""} onChange={e => setForm({ ...form, gameId: e.target.value })} />
          <FormInput label="الدور" value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="leader/vice/chief/elite/member" />
          <FormInput label="المستوى" type="number" value={form.level || ""} onChange={e => setForm({ ...form, level: e.target.value })} />
          <FormInput label="الفوز" type="number" value={form.wins || ""} onChange={e => setForm({ ...form, wins: e.target.value })} />
          <FormInput label="البلد" value={form.country || ""} onChange={e => setForm({ ...form, country: e.target.value })} />
          <div className="border-t border-[var(--border)] pt-4 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)]">بيانات الدخول إلى الدردشة</span>
            </div>
            <FormInput label="اسم المستخدم في الدردشة" value={form.chatName || ""} onChange={e => setForm({ ...form, chatName: e.target.value })} placeholder="الاسم الذي يسجل به في الدردشة" />
            <FormInput label="كلمة سر الدردشة" value={form.chatPassword || ""} onChange={e => setForm({ ...form, chatPassword: e.target.value })} placeholder="كلمة السر للدخول إلى الدردشة" />
          </div>
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}

// ===================== Conversations Tab =====================
function ConversationsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const load = () => { setLoading(true); chatApi.getConversations().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({ type: "group", createdBy: "admin" }); setModal(true); };
  const openEdit = (row: any) => { setEdit(row); setForm({ ...row }); setModal(true); };

  const save = async () => {
    try {
      if (edit) await chatApi.updateConversation(edit.id, form);
      else await chatApi.createConversation(form);
      setModal(false); load();
    } catch (err: any) { alert("خطأ: " + (err.message || "فشل الحفظ")); }
  };

  const remove = async (row: any) => {
    if (!confirm("هل أنت متأكد من حذف المحادثة؟")) return;
    try { await chatApi.deleteConversation(row.id); load(); }
    catch (err: any) { alert("خطأ: " + (err.message || "فشل الحذف")); }
  };

  const columns = [
    { key: "name", label: "الاسم" },
    { key: "type", label: "النوع", render: (v: string) => v === "group" ? "مجموعة" : "خاص" },
    { key: "lastMessage", label: "آخر رسالة" },
    { key: "lastMessageAt", label: "آخر نشاط", render: (v: string) => v ? new Date(v).toLocaleDateString("ar") : "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">{data.length} محادثة</p>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-[10px] glass hover:bg-[var(--surface-hover)] transition-colors" title="تحديث"><RefreshCw size={15} /></button>
          <Button onClick={openAdd}><Plus size={16} /> إضافة محادثة</Button>
        </div>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={remove} />}

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "تعديل المحادثة" : "إضافة محادثة"}>
        <div className="space-y-4 px-1">
          <FormInput label="الاسم" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormTextarea label="الوصف" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          <FormInput label="رابط الصورة" value={form.image || ""} onChange={e => setForm({ ...form, image: e.target.value })} />
          {!edit && (
            <FormInput label="معرف المنشئ" value={form.createdBy || "admin"} onChange={e => setForm({ ...form, createdBy: e.target.value })} />
          )}
          <Button onClick={save} className="w-full">{edit ? "تحديث" : "إضافة"}</Button>
        </div>
      </Modal>
    </div>
  );
}

// ===================== Messages Tab =====================
function MessagesTab() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [convId, setConvId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConvs = () => { chatApi.getConversations().then(setConversations); };

  useEffect(() => { loadConvs(); }, []);

  const loadMessages = async (id: string) => {
    setConvId(id);
    if (!id) return;
    setLoading(true);
    try { const msgs = await chatApi.getMessages(id); setMessages(msgs); }
    catch { setMessages([]); }
    setLoading(false);
  };

  const deleteMsg = async (msg: any) => {
    if (!confirm("حذف الرسالة للجميع؟")) return;
    try { await chatApi.deleteMessage(msg.id, "admin", true); loadMessages(convId); }
    catch (err: any) { alert("خطأ: " + (err.message || "فشل الحذف")); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select value={convId} onChange={e => loadMessages(e.target.value)}
          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]">
          <option value="">اختر محادثة</option>
          {conversations.map(c => <option key={c.id} value={c.id}>{c.name || c.id}</option>)}
        </select>
        <button onClick={loadConvs} className="p-3 rounded-[10px] glass hover:bg-[var(--surface-hover)] transition-colors shrink-0" title="تحديث"><RefreshCw size={15} /></button>
      </div>

      {loading ? <Spinner /> : convId && (
        <div className="glass rounded-[18px] p-4 max-h-[500px] overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-[var(--text-dim)] py-8">لا توجد رسائل</p>
          ) : messages.map((msg, i) => {
            const time = msg.created_at ? new Date(msg.created_at).toLocaleString("ar") : "";
            return (
              <div key={msg.id || i} className="flex items-start gap-3 p-3 rounded-[14px] bg-[var(--surface)] group hover:bg-[var(--surface-hover)] transition-colors">
                {msg.senderAvatar ? <img src={msg.senderAvatar} alt="" className="w-8 h-8 rounded-full shrink-0" onError={e => (e.target as HTMLImageElement).style.display = "none"} />
                  : <div className="w-8 h-8 rounded-full shrink-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-[10px] font-bold text-white">{msg.senderName?.charAt(0) || "?"}</div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{msg.senderName || "مجهول"}</span>
                    <span className="text-[10px] text-[var(--text-dim)]">{time}</span>
                    {msg.type !== "text" && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(0,229,255,0.1)] text-[var(--primary)]">{msg.type}</span>}
                  </div>
                  <p className="text-sm mt-0.5 break-words">{msg.content || (msg.fileUrl ? "📎 مرفق" : "")}</p>
                  {msg.fileUrl && (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--primary)] underline inline-block mt-0.5">عرض المرفق</a>
                  )}
                </div>
                <button onClick={() => deleteMsg(msg)}
                  className="p-1.5 rounded-[8px] text-[var(--text-dim)] hover:text-[var(--danger)] hover:bg-[rgba(229,9,20,0.1)] transition-all opacity-0 group-hover:opacity-100 shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================== Settings Tab =====================
function SettingsTab() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  useEffect(() => { api.getMembers().then(all => setMembers(all.filter(m => m.chatName))); }, []);

  const defaults = {
    ownBubbleBg: "#005C4B", ownBubbleText: "#FFFFFF",
    otherBubbleBg: "#1A1A2E", otherBubbleText: "#FFFFFF",
    chatBg: "#0A0A1A", headerBg: "#0D0D20", inputBg: "#1A1A2E",
    accentColor: "#00E5FF",
  };

  const load = () => {
    setLoading(true);
    if (selectedMemberId) {
      chatApi.getMemberSettings(selectedMemberId).then(s => {
        setSettings(Object.keys(s).length ? s : defaults);
      }).catch(() => setSettings(defaults)).finally(() => setLoading(false));
    } else {
      chatApi.getChatSettings().then(s => {
        setSettings(s && s.id ? s : defaults);
      }).catch(() => setSettings(defaults)).finally(() => setLoading(false));
    }
  };

  useEffect(() => { load(); }, [selectedMemberId]);

  const save = async () => {
    setSaving(true);
    try {
      if (selectedMemberId) {
        await chatApi.updateMemberSettings(selectedMemberId, settings);
      } else {
        await chatApi.updateChatSettings(settings);
      }
      alert("تم حفظ الإعدادات");
    } catch (err: any) { alert("خطأ: " + (err.message || "فشل الحفظ")); }
    setSaving(false);
  };

  const colorFields = [
    { key: "ownBubbleBg", label: "لون خلفية رسالتي", default: "#005C4B" },
    { key: "ownBubbleText", label: "لون نص رسالتي", default: "#FFFFFF" },
    { key: "otherBubbleBg", label: "لون خلفية رسائل الآخرين", default: "#1A1A2E" },
    { key: "otherBubbleText", label: "لون نص رسائل الآخرين", default: "#FFFFFF" },
    { key: "chatBg", label: "لون خلفية الدردشة", default: "#0A0A1A" },
    { key: "headerBg", label: "لون خلفية رأس الدردشة", default: "#0D0D20" },
    { key: "inputBg", label: "لون خلفية مربع الإدخال", default: "#1A1A2E" },
    { key: "accentColor", label: "اللون المميز (accent)", default: "#00E5FF" },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">إعدادات ألوان الدردشة</p>
        <button onClick={load} className="p-2 rounded-[10px] glass hover:bg-[var(--surface-hover)] transition-colors" title="تحديث"><RefreshCw size={15} /></button>
      </div>

      {/* Member selector */}
      <div className="glass rounded-[18px] p-4">
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">اختر العضو</label>
        <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[14px] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]">
          <option value="">الإعدادات العامة (كل الأعضاء)</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>
              {m.name || m.chatName} ({m.chatName})
            </option>
          ))}
        </select>
        {selectedMemberId && (
          <p className="text-xs text-[var(--primary)] mt-2">يتم تطبيق هذه الإعدادات على {members.find(m => m.id === selectedMemberId)?.name || selectedMemberId} فقط في الدردشة</p>
        )}
      </div>

      <div className="glass rounded-[18px] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={18} className="text-[var(--primary)]" />
          <h3 className="font-bold text-sm">ألوان تصميم الدردشة</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {colorFields.map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">{f.label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={settings[f.key] || f.default}
                  onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                  className="w-10 h-10 rounded-[10px] border border-[var(--border)] cursor-pointer bg-transparent p-0.5" />
                <input type="text" value={settings[f.key] || f.default}
                  onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                  className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-3 py-2 text-xs font-mono text-[var(--text)] outline-none focus:border-[var(--primary)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 rounded-[14px]" style={{ background: settings.chatBg || "#0A0A1A" }}>
          <p className="text-xs text-[var(--text-dim)] mb-3">معاينة:</p>
          <div className="space-y-2">
            <div className="flex justify-end">
              <div className="px-3.5 py-2 rounded-[18px] rounded-bl-[6px] max-w-[70%]" style={{ background: settings.ownBubbleBg || "#005C4B" }}>
                <p className="text-sm" style={{ color: settings.ownBubbleText || "#FFF" }}>رسالتي</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="px-3.5 py-2 rounded-[18px] rounded-br-[6px] max-w-[70%]" style={{ background: settings.otherBubbleBg || "#1A1A2E" }}>
                <p className="text-sm" style={{ color: settings.otherBubbleText || "#FFF" }}>رسالة من عضو آخر</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={save} disabled={saving} className="w-full">
        <Save size={16} /> {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
      </Button>
    </div>
  );
}
