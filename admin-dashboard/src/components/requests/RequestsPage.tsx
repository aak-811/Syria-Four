"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { Loader2, AlertCircle, Inbox, CheckCircle, XCircle, Clock, User, Hash, FileText, ExternalLink, Trash2 } from "lucide-react";

interface RequestData {
  _id: string;
  playerName: string;
  playerGameId: string;
  reason: string;
  tournamentId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface TournamentData {
  _id: string;
  title: string;
  participants?: { name: string; gameId: string }[];
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [reqs, tourns] = await Promise.all([
        api.getRequests(),
        api.getTournaments(),
      ]);
      setRequests(reqs || []);
      setTournaments(tourns || []);
    } catch (err: any) {
      setError(err.message || "فشل تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(requestId: string) {
    setActionLoading(requestId);
    try {
      const req = requests.find((r) => r._id === requestId);
      if (!req) return;
      const tournament = tournaments.find((t) => t._id === req.tournamentId);
      if (tournament) {
        const participants = tournament.participants || [];
        participants.push({ name: req.playerName, gameId: req.playerGameId });
        await api.updateTournament(req.tournamentId, { participants });
      }
      await api.updateRequest(requestId, { status: "approved" });
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "approved" } : r))
      );
    } catch (err: any) {
      setError(err.message || "فشل قبول الطلب");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(requestId: string) {
    setActionLoading(requestId);
    try {
      await api.updateRequest(requestId, { status: "rejected" });
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "rejected" } : r))
      );
    } catch (err: any) {
      setError(err.message || "فشل رفض الطلب");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(requestId: string) {
    setActionLoading(requestId);
    try {
      await api.deleteRequest(requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err: any) {
      setError(err.message || "فشل حذف الطلب");
    } finally {
      setActionLoading(null);
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const historyRequests = requests.filter((r) => r.status !== "pending");

  function getTournamentTitle(tournamentId: string) {
    const t = tournaments.find((t) => t._id === tournamentId);
    return t ? t.title : tournamentId;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#E50914] mx-auto" />
          <p className="text-[#9CA3AF] text-sm mt-4">جارٍ تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={40} className="text-[#FF3B30] mx-auto" />
          <p className="text-[#FF3B30] text-sm mt-4">{error}</p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={loadData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black">طلبات الانضمام</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">إدارة طلبات الانضمام للبطولات</p>
      </motion.div>

      {error && (
        <div className="flex items-center gap-3 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.2)] rounded-[14px] px-4 py-3">
          <AlertCircle size={16} className="text-[#FF3B30] shrink-0" />
          <p className="text-sm text-[#FF3B30]">{error}</p>
          <button onClick={() => setError("")} className="ml-auto text-[#FF3B30] hover:text-white text-xs font-semibold">تجاهل</button>
        </div>
      )}

      <GlassCard className="p-2">
        <div className="flex gap-1">
          {[
            { id: "pending" as const, label: `معلقة (${pendingRequests.length})` },
            { id: "history" as const, label: "السجل" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300",
                activeTab === tab.id ? "bg-[#E50914] text-white" : "text-[#6B7280] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {activeTab === "pending" && (
        <>
          {pendingRequests.length === 0 ? (
            <GlassCard>
              <div className="text-center py-10">
                <Inbox size={48} className="text-[#6B7280] mx-auto mb-4" />
                <p className="text-[#9CA3AF] font-semibold">لا توجد طلبات معلقة</p>
                <p className="text-[#6B7280] text-sm mt-1">كل شيء محدث!</p>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req, i) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <GlassCard className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFC107] to-[#FFD700]" />
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[12px] bg-[rgba(255,193,7,0.1)] flex items-center justify-center">
                          <User size={20} className="text-[#FFC107]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{req.playerName}</h3>
                          <p className="text-xs text-[#6B7280]">ID: {req.playerGameId}</p>
                        </div>
                      </div>
                      <Badge variant="warning" size="sm">معلق</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Hash size={14} className="text-[#6B7280]" />
                        <span className="text-[#9CA3AF]">البطولة:</span>
                        <span className="font-semibold">{getTournamentTitle(req.tournamentId)}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <FileText size={14} className="text-[#6B7280] mt-0.5" />
                        <span className="text-[#9CA3AF]">السبب:</span>
                        <span className="text-white">{req.reason}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-[#6B7280]" />
                        <span className="text-[#6B7280]">{formatDate(req.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        className="flex-1"
                        loading={actionLoading === req._id}
                        onClick={() => handleApprove(req._id)}
                      >
                        <CheckCircle size={14} /> قبول
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        loading={actionLoading === req._id}
                        onClick={() => handleReject(req._id)}
                      >
                        <XCircle size={14} /> رفض
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
        <>
          {historyRequests.length === 0 ? (
            <GlassCard>
              <div className="text-center py-10">
                <Clock size={48} className="text-[#6B7280] mx-auto mb-4" />
                <p className="text-[#9CA3AF] font-semibold">لا يوجد سجل بعد</p>
                <p className="text-[#6B7280] text-sm mt-1">الطلبات المعالجة ستظهر هنا</p>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {historyRequests.map((req, i) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <GlassCard className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0",
                      req.status === "approved" ? "bg-[rgba(0,230,118,0.1)]" : "bg-[rgba(255,59,48,0.1)]"
                    )}>
                      {req.status === "approved"
                        ? <CheckCircle size={20} className="text-[#00E676]" />
                        : <XCircle size={20} className="text-[#FF3B30]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{req.playerName}</span>
                        <Badge variant={req.status === "approved" ? "success" : "danger"} size="sm">
                          {req.status === "approved" ? "مقبول" : "مرفوض"}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {req.playerGameId} &middot; {getTournamentTitle(req.tournamentId)}
                      </p>
                      <p className="text-xs text-[#6B7280]">{formatDate(req.createdAt)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={actionLoading === req._id}
                      onClick={() => handleDelete(req._id)}
                      className="text-[#FF3B30]"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
