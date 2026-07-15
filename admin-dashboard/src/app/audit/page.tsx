"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AuditLogsPage from "@/components/audit/AuditLogsPage";

export default function Audit() {
  return (
    <DashboardLayout>
      <AuditLogsPage />
    </DashboardLayout>
  );
}
