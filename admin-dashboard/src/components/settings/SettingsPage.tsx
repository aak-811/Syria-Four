"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import {
  Settings, Globe, Palette, Languages, Link2, Key, Database,
  Smartphone, Save, Shield, Bell,
} from "lucide-react";

const settingTabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "localization", label: "Localization", icon: Languages },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "api", label: "API & Security", icon: Key },
  { id: "backup", label: "Backup", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
                <Input label="Website Name" defaultValue="SYRIA FOUR" />
                <Input label="Website Description" defaultValue="Premium Free Fire Clan" />
                <Input label="Contact Email" defaultValue="admin@syria4.clan" />
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
                  {["Dark (Default)", "Darker", "OLED Black"].map((theme) => (
                    <div key={theme} className={`rounded-[14px] p-4 border-2 text-center cursor-pointer transition-all ${
                      theme === "Dark (Default)" ? "border-[#E50914] bg-[rgba(229,9,20,0.05)]" : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]"
                    }`}>
                      <div className="w-full h-12 rounded-[10px] bg-gradient-to-br from-[#111] to-[#0A0A0A] mb-2" />
                      <p className="text-xs font-semibold">{theme}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm font-medium text-[#9CA3AF]">Accent Color</label>
                  <div className="flex gap-2">
                    {["#E50914", "#FFD700", "#00E676", "#FF3B30", "#7C3AED"].map((c) => (
                      <button key={c} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white transition-all" style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "localization" && (
              <div className="space-y-5">
                <Input label="Default Language" defaultValue="Arabic (AR)" />
                <Input label="RTL Support" defaultValue="Enabled" />
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
                {["Discord", "YouTube", "Instagram", "Telegram", "TikTok"].map((platform) => (
                  <Input key={platform} label={platform} placeholder={`${platform.toLowerCase()}.com/syria4`} />
                ))}
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-5">
                <div className="glass rounded-[14px] p-4">
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">API Key</label>
                  <div className="flex gap-2">
                    <input readOnly value="s4_api_live_8x3k9m2n7v..." className="flex-1 bg-[rgba(255,255,255,0.04)] rounded-[12px] px-4 py-2.5 text-sm text-[#9CA3AF] border border-[rgba(255,255,255,0.06)] outline-none" />
                    <Button variant="ghost" size="sm">Copy</Button>
                    <Button variant="ghost" size="sm" className="text-[#FFC107]">Regenerate</Button>
                  </div>
                </div>
                <Input label="JWT Secret" type="password" defaultValue="••••••••••••••••" />
                <div className="flex items-center justify-between glass rounded-[14px] p-4">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-[#FFC107]" />
                    <div>
                      <p className="text-sm font-semibold">Rate Limiting</p>
                      <p className="text-[10px] text-[#9CA3AF]">60 requests per minute</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[rgba(255,255,255,0.1)] rounded-full peer peer-checked:bg-[#E50914] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === "backup" && (
              <div className="space-y-5">
                <div className="glass rounded-[14px] p-6 text-center">
                  <Database size={40} className="mx-auto text-[#6B7280] mb-3" />
                  <p className="text-lg font-bold mb-1">Automatic Backup</p>
                  <p className="text-sm text-[#9CA3AF] mb-4">Last backup: 2 hours ago</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="primary"><Database size={16} /> Backup Now</Button>
                    <Button variant="ghost">Restore</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between glass rounded-[14px] p-4">
                  <div>
                    <p className="text-sm font-semibold">Auto-backup every 24h</p>
                    <p className="text-[10px] text-[#9CA3AF]">Database + Uploads + Config</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[rgba(255,255,255,0.1)] rounded-full peer peer-checked:bg-[#00E676] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[rgba(255,255,255,0.06)]">
              <Button variant="ghost" className="text-[#FF3B30]">Reset to Defaults</Button>
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
