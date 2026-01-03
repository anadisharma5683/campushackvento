"use client";

import { useState } from "react";
import { Internship } from "@/hooks/useInternships";
import { useAuthStore } from "@/store/authStore";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Briefcase, MapPin, DollarSign, Calendar, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface InternshipListProps {
  internships: Internship[];
  loading: boolean;
}

export default function InternshipList({ internships, loading }: InternshipListProps) {
  const { user } = useAuthStore();
  const [applying, setApplying] = useState<string | null>(null);

  const handleApply = async (internship: Internship) => {
    if (!user) {
      toast.error("Please sign in to apply");
      return;
    }

    // Check eligibility
    const userGpa = user.profile?.gpa || 0;
    const minGpa = internship.eligibilityCriteria?.minGpa || 0;
    
    if (userGpa < minGpa) {
      toast.error(`Minimum GPA requirement is ${minGpa}. Your GPA is ${userGpa}`);
      return;
    }

    const userYear = user.profile?.year;
    const requiredYears = internship.eligibilityCriteria?.year || [];
    if (requiredYears.length > 0 && userYear && !requiredYears.includes(userYear)) {
      toast.error(`This internship is only for Year ${requiredYears.join(", ")} students`);
      return;
    }

    setApplying(internship.id);
    try {
      await addDoc(collection(db, "applications"), {
        studentId: user.uid,
        internshipId: internship.id,
        status: "applied",
        timeline: [
          {
            timestamp: new Date().toISOString(),
            event: "Applied",
            description: `Applied to ${internship.title} at ${internship.company}`,
          },
        ],
        createdAt: serverTimestamp(),
      });

      // Update applicants count
      const internshipRef = doc(db, "internships", internship.id);
      const internshipSnap = await getDoc(internshipRef);
      if (internshipSnap.exists()) {
        const currentApplicants = internshipSnap.data().applicants || 0;
        await updateDoc(internshipRef, { applicants: currentApplicants + 1 });
      }

      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error applying:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships available</h3>
        <p className="text-gray-600">Check back later for new opportunities!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Internships</h2>
      {internships.map((internship, index) => (
        <motion.div
          key={internship.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{internship.title}</h3>
                  <p className="text-lg text-gray-700 font-medium">{internship.company}</p>
                </div>
                {internship.status === "open" ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Open
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Closed
                  </span>
                )}
              </div>

              {internship.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{internship.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {internship.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{internship.location}</span>
                  </div>
                )}
                {internship.stipend > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{internship.stipend.toLocaleString()}/month</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              {internship.eligibilityCriteria && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Eligibility:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {internship.eligibilityCriteria.minGpa && (
                      <li>• Minimum GPA: {internship.eligibilityCriteria.minGpa}</li>
                    )}
                    {internship.eligibilityCriteria.year && (
                      <li>• Year: {internship.eligibilityCriteria.year.join(", ")}</li>
                    )}
                    {internship.eligibilityCriteria.department && (
                      <li>• Department: {internship.eligibilityCriteria.department.join(", ")}</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">{internship.applicants}</span> applicants
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => handleApply(internship)}
                disabled={applying === internship.id || internship.status === "closed"}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying === internship.id ? "Applying..." : "Apply Now"}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

