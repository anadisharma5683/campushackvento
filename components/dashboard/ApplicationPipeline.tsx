"use client";

import { Application } from "@/hooks/useApplications";
import { Briefcase, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface ApplicationPipelineProps {
  applications: Application[];
  loading: boolean;
}

const statusConfig = {
  applied: { label: "Applied", color: "bg-blue-100 text-blue-700", icon: Clock },
  interviewing: { label: "Interviewing", color: "bg-yellow-100 text-yellow-700", icon: Briefcase },
  offer_received: { label: "Offer Received", color: "bg-green-100 text-green-700", icon: CheckCircle },
  accepted: { label: "Accepted", color: "bg-purple-100 text-purple-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function ApplicationPipeline({ applications, loading }: ApplicationPipelineProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-600">Start applying to internships to see your pipeline here!</p>
      </div>
    );
  }

  // Group applications by status
  const grouped = applications.reduce((acc, app) => {
    if (!acc[app.status]) acc[app.status] = [];
    acc[app.status].push(app);
    return acc;
  }, {} as Record<string, Application[]>);

  const statusOrder = ["applied", "interviewing", "offer_received", "accepted", "rejected"];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Pipeline</h2>
      
      {/* Kanban View */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statusOrder.map((status) => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const apps = grouped[status] || [];
          const Icon = config.icon;

          return (
            <div key={status} className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5" />
                <h3 className="font-semibold text-gray-900">{config.label}</h3>
                <span className="ml-auto px-2 py-1 bg-white rounded-full text-xs font-medium">
                  {apps.length}
                </span>
              </div>
              <div className="space-y-3">
                {apps.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {app.internship?.title || "Unknown Position"}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {app.internship?.company || "Unknown Company"}
                    </p>
                    {app.timeline && app.timeline.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {new Date(app.timeline[0].timestamp).toLocaleDateString()}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed List View */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">All Applications</h3>
        {applications.map((app, index) => {
          const config = statusConfig[app.status as keyof typeof statusConfig];
          const Icon = config.icon;

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    {app.internship?.title || "Unknown Position"}
                  </h4>
                  <p className="text-gray-700 font-medium mb-2">
                    {app.internship?.company || "Unknown Company"}
                  </p>
                </div>
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                  <Icon className="w-4 h-4" />
                  {config.label}
                </span>
              </div>

              {app.timeline && app.timeline.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Timeline:</p>
                  <div className="space-y-2">
                    {app.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">{event.event}</p>
                          {event.description && (
                            <p className="text-gray-600 text-xs">{event.description}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {app.documents && app.documents.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {app.documents.length} document(s) attached
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

