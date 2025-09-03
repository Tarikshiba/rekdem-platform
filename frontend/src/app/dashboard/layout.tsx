// frontend/src/app/dashboard/layout.tsx

import Sidebar from "@/components/Sidebar";
import React from "react";

// Ce layout s'appliquera à toutes les pages dans /dashboard/*
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}