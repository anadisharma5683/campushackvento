"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard />
    </ProtectedRoute>
  );
}

