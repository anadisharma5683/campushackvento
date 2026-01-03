"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useInternships } from "@/hooks/useInternships";
import { useApplications } from "@/hooks/useApplications";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InternshipList from "@/components/dashboard/InternshipList";
import ApplicationPipeline from "@/components/dashboard/ApplicationPipeline";
import MobileNav from "@/components/navigation/MobileNav";
import Sidebar from "@/components/navigation/Sidebar";
import { Bell, LogOut, User, Briefcase, MessageSquare, FileText } from "lucide-react";
import CareerBot from "@/components/ai/CareerBot";
import ExperienceWall from "@/components/dashboard/ExperienceWall";
import ResumeAnalyzer from "@/components/dashboard/ResumeAnalyzer";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { internships, loading: internshipsLoading } = useInternships("open");
  const { applications, loading: applicationsLoading } = useApplications();
  const [activeTab, setActiveTab] = useState<"internships" | "applications" | "reviews" | "resume">("internships");
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const appliedCount = applications.filter((app) => app.status === "applied").length;
  const interviewingCount = applications.filter((app) => app.status === "interviewing").length;
  const offerCount = applications.filter((app) => app.status === "offer_received" || app.status === "accepted").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSignOut={handleSignOut}
          user={user}
        />
      </div>

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4 md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.displayName || "Student"}!
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {user?.profile?.department || "Department"} • Year {user?.profile?.year || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="w-6 h-6" />
                  {appliedCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-4 py-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Applied</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{appliedCount}</p>
                </div>
                <Briefcase className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviewing</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{interviewingCount}</p>
                </div>
                <MessageSquare className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offers</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{offerCount}</p>
                </div>
                <FileText className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          {activeTab === "internships" && (
            <InternshipList internships={internships} loading={internshipsLoading} />
          )}
          {activeTab === "applications" && (
            <ApplicationPipeline applications={applications} loading={applicationsLoading} />
          )}
          {activeTab === "reviews" && <ExperienceWall />}
          {activeTab === "resume" && <ResumeAnalyzer />}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0">
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Career Bot */}
      <CareerBot />
    </div>
  );
}

