"use client";

import { Briefcase, FileText, MessageSquare, User, LogOut, GraduationCap } from "lucide-react";
import { UserProfile } from "@/store/authStore";

interface SidebarProps {
  activeTab: "internships" | "applications" | "reviews" | "resume";
  setActiveTab: (tab: "internships" | "applications" | "reviews" | "resume") => void;
  onSignOut: () => void;
  user: UserProfile | null;
}

export default function Sidebar({ activeTab, setActiveTab, onSignOut, user }: SidebarProps) {
  const navItems = [
    { id: "internships" as const, label: "Internships", icon: Briefcase },
    { id: "applications" as const, label: "Applications", icon: FileText },
    { id: "reviews" as const, label: "Reviews", icon: MessageSquare },
    { id: "resume" as const, label: "Resume AI", icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Campus to Career</h2>
            <p className="text-xs text-gray-600">Student Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{user?.displayName || "Student"}</p>
          <p className="text-xs text-gray-600">{user?.email || ""}</p>
          {user?.profile?.gpa && (
            <p className="text-xs text-gray-600 mt-1">GPA: {user.profile.gpa}</p>
          )}
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

