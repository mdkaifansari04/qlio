import type React from "react";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
