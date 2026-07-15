"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RequestsPage from "@/components/requests/RequestsPage";

export default function Requests() {
  return (
    <DashboardLayout>
      <RequestsPage />
    </DashboardLayout>
  );
}
