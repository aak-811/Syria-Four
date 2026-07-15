"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { HeadphonesIcon, Check, Trash2, Mail, AlertCircle } from "lucide-react";
import type { SupportRequest } from "@/types";

export default function SupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchSupport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSupport();
      setRequests(data);
    } catch {
      setError("Failed to load support requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupport();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.updateSupport(id, { status: "read" });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "read" } : r))
      );
    } catch {
      setError("Failed to update request");
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await api.deleteSupport(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setConfirmDelete(null);
    } catch {
      setError("Failed to delete request");
    }
  };

  const unreadCount = requests.filter(
    (r) => r.status === "new" || r.status === "unread"
  ).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black">Support</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Manage player support requests
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="danger" size="md">
            {unreadCount} unread
          </Badge>
        )}
      </motion.div>

      {error && (
        <GlassCard className="flex items-center gap-3 text-[#FF3B30]">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchSupport}
            className="ml-auto"
          >
            Retry
          </Button>
        </GlassCard>
      )}

      {loading ? (
        <GlassCard>
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          </div>
        </GlassCard>
      ) : requests.length === 0 ? (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HeadphonesIcon size={48} className="text-[#6B7280] mb-4" />
            <p className="text-lg font-bold mb-1">All clear</p>
            <p className="text-sm text-[#9CA3AF]">
              No support requests at the moment.
            </p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Player
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Message
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Date
                  </th>
                  <th className="text-right text-xs font-semibold text-[#6B7280] px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-sm">
                        {req.playerName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#9CA3AF]">
                        {req.type || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <span className="text-sm text-[#9CA3AF] block truncate">
                        {req.message || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          req.status === "read" ? "success" : "warning"
                        }
                        size="sm"
                      >
                        {req.status === "read" ? "Read" : "New"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#9CA3AF]">
                        {req.date ? formatDate(req.date) : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {req.status !== "read" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => markAsRead(req.id)}
                          >
                            <Check size={14} /> Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#FF3B30]"
                          onClick={() => setConfirmDelete(req.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Request"
      >
        <p className="text-[#9CA3AF] text-sm">
          Are you sure you want to delete this support request? This action
          cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() =>
              confirmDelete && deleteRequest(confirmDelete)
            }
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
