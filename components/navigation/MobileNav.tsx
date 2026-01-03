"use client";

import { Briefcase, FileText, MessageSquare, User } from "lucide-react";

interface MobileNavProps {
  activeTab: "internships" | "applications" | "reviews" | "resume";
  setActiveTab: (tab: "internships" | "applications" | "reviews" | "resume") => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const navItems = [
    { id: "internships" as const, label: "Jobs", icon: Briefcase },
    { id: "applications" as const, label: "Applied", icon: FileText },
    { id: "reviews" as const, label: "Reviews", icon: MessageSquare },
    { id: "resume" as const, label: "Resume", icon: User },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-blue-600" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

