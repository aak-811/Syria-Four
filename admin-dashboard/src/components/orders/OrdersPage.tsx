"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ShoppingCart, Check, Trash2, AlertCircle } from "lucide-react";
import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDone = async (id: string) => {
    try {
      await api.updateOrder(id, { status: "done" });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "done" } : o))
      );
    } catch {
      setError("Failed to update order");
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await api.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setConfirmDelete(null);
    } catch {
      setError("Failed to delete order");
    }
  };

  const pendingCount = orders.filter((o) => o.status !== "done").length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black">Orders</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Manage player orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning" size="md">
            {pendingCount} pending
          </Badge>
        </div>
      </motion.div>

      {error && (
        <GlassCard className="flex items-center gap-3 text-[#FF3B30]">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
          <Button size="sm" variant="ghost" onClick={fetchOrders} className="ml-auto">
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
      ) : orders.length === 0 ? (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart size={48} className="text-[#6B7280] mb-4" />
            <p className="text-lg font-bold mb-1">No orders yet</p>
            <p className="text-sm text-[#9CA3AF]">
              Orders placed by players will appear here.
            </p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">Player</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">Package</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] px-6 py-4">Date</th>
                  <th className="text-right text-xs font-semibold text-[#6B7280] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-sm">{order.playerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#9CA3AF]">{order.item || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={order.status === "done" ? "success" : "warning"}
                        size="sm"
                      >
                        {order.status || "pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#9CA3AF]">
                        {order.date ? formatDate(order.date) : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {order.status !== "done" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => markAsDone(order.id)}
                          >
                            <Check size={14} /> Done
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#FF3B30]"
                          onClick={() => setConfirmDelete(order.id)}
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
        title="Delete Order"
      >
        <p className="text-[#9CA3AF] text-sm">
          Are you sure you want to delete this order? This action cannot be undone.
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
            onClick={() => confirmDelete && deleteOrder(confirmDelete)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
