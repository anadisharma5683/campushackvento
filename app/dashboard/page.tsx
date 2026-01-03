"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard />
    </ProtectedRoute>
  );
}

