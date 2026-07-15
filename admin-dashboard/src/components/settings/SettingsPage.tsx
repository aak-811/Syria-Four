"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import {
  Settings, Globe, Palette, Languages, Link2, Key, Database,
  Save, Shield,
} from "lucide-react";
import { api } from "@/lib/api";

const STORAGE_KEY = "syria4_settings";

const defaultSettings = {
  siteName: "SYRIA FOUR",
  siteDescription: "Premium Free Fire Clan",
  contactEmail: "admin@syria4.clan",
  theme: "dark",
  accentColor: "#E50914",
  language: "Arabic (AR)",
  discord: "",
  youtube: "",
  instagram: "",
  telegram: "",
  tiktok: "",
};

const settingTabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "localization", label: "Localization", icon: Languages },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "api", label: "API & Security", icon: Key },
  { id: "backup", label: "Backup", icon: Database },
];

function loadSettings() {
  if (typeof window === "undefined") return { ...defaultSettings };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(loadSettings);

  useEffect(() => {
    setForm(loadSettings());
  }, []);

  const update = (key: string, value: string) => {
    setForm((prev: Record<string, string>) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    if (form.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetDefaults = () => {
    setForm({ ...defaultSettings });
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  };

  const exportData = async () => {
    try {
      const endpoints = [
        api.getMembers(),
        api.getTournaments(),
        api.getEvents(),
        api.getLeaderboard(),
        api.getOrders(),
        api.getSupport(),
        api.getInstagram(),
        api.getGallery(),
        api.getVideos(),
        api.getNotifications(),
        api.getRequests(),
        api.getPlayers(),
      ];
      const [members, tournaments, events, leaderboard, orders, support, instagram, gallery, videos, notifications, requests, players] = await Promise.all(endpoints);
      const blob = new Blob([JSON.stringify({ members, tournaments, events, leaderboard, orders, support, instagram, gallery, videos, notifications, requests, players, settings: form }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `syria4-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
  };

  const ActiveIcon = settingTabs.find(t => t.id === activeTab)?.icon || Settings;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Configure your clan platform</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <GlassCard className="lg:w-64 shrink-0 p-2">
          <nav className="space-y-1">
            {settingTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#E50914] text-white"
                    : "text-[#6B7280] hover:text-white hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </GlassCard>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[12px] bg-[rgba(229,9,20,0.1)] flex items-center justify-center">
                <ActiveIcon size={20} className="text-[#E50914]" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{settingTabs.find(t => t.id === activeTab)?.label}</h2>
                <p className="text-xs text-[#9CA3AF]">Configure your settings</p>
              </div>
            </div>

            {activeTab === "general" && (
              <div className="space-y-5">
                <Input label="Website Name" value={form.siteName} onChange={(e) => update("siteName", e.target.value)} />
                <Input label="Website Description" value={form.siteDescription} onChange={(e) => update("siteDescription", e.target.value)} />
                <Input label="Contact Email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Clan Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-[14px] bg-gradient-to-br from-[#E50914] to-[#FF6B35] flex items-center justify-center text-2xl font-black">S4</div>
                    <Button variant="ghost" size="sm">Change Logo</Button>
                    <Button variant="ghost" size="sm" className="text-[#FF3B30]">Remove</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-5">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  {["dark", "light", "oled"].map((theme) => {
                    const label = theme === "dark" ? "Dark (Default)" : theme === "light" ? "Light" : "OLED Black";
                    return (
                      <div
                        key={theme}
                        onClick={() => update("theme", theme)}
                        className={`rounded-[14px] p-4 border-2 text-center cursor-pointer transition-all ${
                          form.theme === theme ? "border-[#E50914] bg-[rgba(229,9,20,0.05)]" : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]"
                        }`}
                      >
                        <div className="w-full h-12 rounded-[10px] bg-gradient-to-br from-[#111] to-[#0A0A0A] mb-2" />
                        <p className="text-xs font-semibold">{label}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm font-medium text-[#9CA3AF]">Accent Color</label>
                  <div className="flex gap-2">
                    {["#E50914", "#FFD700", "#00E676", "#FF3B30", "#7C3AED"].map((c) => (
                      <button
                        key={c}
                        onClick={() => update("accentColor", c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${form.accentColor === c ? "border-white scale-110" : "border-transparent hover:border-white"}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "localization" && (
              <div className="space-y-5">
                <Input label="Default Language" value={form.language} onChange={(e) => update("language", e.target.value)} />
                <Input label="RTL Support" value="Enabled" disabled />
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Available Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {["Arabic", "English", "Turkish", "French"].map((lang) => (
                      <span key={lang} className="px-3 py-1.5 rounded-[10px] text-xs font-semibold bg-[rgba(255,255,255,0.06)] text-white flex items-center gap-2">
                        {lang}
                        <button className="text-[#6B7280] hover:text-[#FF3B30]">&times;</button>
                      </span>
                    ))}
                    <Button variant="ghost" size="sm">+ Add Language</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-5">
                {["discord", "youtube", "instagram", "telegram", "tiktok"].map((platform) => (
                  <Input
                    key={platform}
                    label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    placeholder={`${platform}.com/syria4`}
                    value={(form as any)[platform] || ""}
                    onChange={(e) => update(platform, e.target.value)}
                  />
                ))}
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-5">
                <div className="p-4 rounded-[14px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={20} className="text-[#9CA3AF]" />
                    <p className="text-sm font-semibold">Server-Side Configuration</p>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    API keys, secrets, and security settings are configured server-side for safety.
                    Contact your server administrator to update these values.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "backup" && (
              <div className="space-y-5">
                <div className="glass rounded-[14px] p-6 text-center">
                  <Database size={40} className="mx-auto text-[#6B7280] mb-3" />
                  <p className="text-lg font-bold mb-1">Export Data</p>
                  <p className="text-sm text-[#9CA3AF] mb-4">Download all platform data as a JSON file</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="primary" onClick={exportData}><Database size={16} /> Export Data</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[rgba(255,255,255,0.06)]">
              <Button variant="ghost" className="text-[#FF3B30]" onClick={resetDefaults}>Reset to Defaults</Button>
              <Button variant="primary" glow onClick={handleSave}>
                {saved ? "✓ Saved!" : <><Save size={16} /> Save Changes</>}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
