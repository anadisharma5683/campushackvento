"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { LogOut, Users, Briefcase, TrendingUp, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface Student {
  id: string;
  displayName: string;
  email: string;
  profile?: {
    gpa?: number;
    department?: string;
    year?: number;
  };
}

interface PlacementStats {
  placed: number;
  unplaced: number;
  total: number;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [placementStats, setPlacementStats] = useState<PlacementStats>({ placed: 0, unplaced: 0, total: 0 });
  const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [minGpa, setMinGpa] = useState<number | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchPlacementStats();
  }, []);

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const snapshot = await getDocs(q);
      const studentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];
      setStudents(studentsData);
      calculateDepartmentStats(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacementStats = async () => {
    try {
      const applicationsSnapshot = await getDocs(collection(db, "applications"));
      const applications = applicationsSnapshot.docs.map((doc) => doc.data());
      
      const placedStudents = new Set(
        applications
          .filter((app) => app.status === "accepted" || app.status === "offer_received")
          .map((app) => app.studentId)
      );

      const allStudentsSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
      const totalStudents = allStudentsSnapshot.size;

      setPlacementStats({
        placed: placedStudents.size,
        unplaced: totalStudents - placedStudents.size,
        total: totalStudents,
      });
    } catch (error) {
      console.error("Error fetching placement stats:", error);
    }
  };

  const calculateDepartmentStats = (studentsData: Student[]) => {
    const deptCounts: Record<string, number> = {};
    studentsData.forEach((student) => {
      const dept = student.profile?.department || "Unknown";
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    setDepartmentStats(deptCounts);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredStudents();
    const headers = ["Name", "Email", "Department", "Year", "GPA"];
    const rows = filtered.map((s) => [
      s.displayName || "N/A",
      s.email || "N/A",
      s.profile?.department || "N/A",
      s.profile?.year || "N/A",
      s.profile?.gpa || "N/A",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-export-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const getFilteredStudents = () => {
    return students.filter((student) => {
      if (filterYear && student.profile?.year !== filterYear) return false;
      if (filterDepartment && student.profile?.department !== filterDepartment) return false;
      if (minGpa !== null && (student.profile?.gpa || 0) < minGpa) return false;
      return true;
    });
  };

  const placementChartData = [
    { name: "Placed", value: placementStats.placed, color: "#10b981" },
    { name: "Unplaced", value: placementStats.unplaced, color: "#ef4444" },
  ];

  const departmentChartData = Object.entries(departmentStats).map(([name, value]) => ({
    name,
    value,
  }));

  const filteredStudents = getFilteredStudents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TPO Command Center</h1>
              <p className="text-sm text-gray-600 mt-1">Analytics & Student Management</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 md:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{placementStats.total}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Placed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{placementStats.placed}</p>
              </div>
              <Briefcase className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unplaced</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{placementStats.unplaced}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Placement Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {placementStats.total > 0
                    ? Math.round((placementStats.placed / placementStats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Placement Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={placementChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {placementChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Students by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Student Directory</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterYear || ""}
                  onChange={(e) => setFilterYear(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>

              <select
                value={filterDepartment || ""}
                onChange={(e) => setFilterDepartment(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Departments</option>
                {Object.keys(departmentStats).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min GPA"
                value={minGpa || ""}
                onChange={(e) => setMinGpa(e.target.value ? parseFloat(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32"
                step="0.1"
                min="0"
                max="10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.displayName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.profile?.department || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.profile?.year || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.profile?.gpa || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}