"use client";

import { useState } from "react";
import { Upload, FileText, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setFile(uploadedFile);

    // Extract text from PDF (simplified - in production, use a PDF parser library)
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      // For MVP, we'll use a simple approach - in production, use pdf-parse or similar
      toast.info("PDF text extraction coming soon. Please paste your resume text manually.");
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read file");
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Please enter or upload your resume text");
      return;
    }

    setLoading(true);
    setImprovements([]);

    try {
      const response = await fetch("/api/resume-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze resume");

      const data = await response.json();
      setImprovements(data.improvements || []);
      toast.success("Resume analyzed successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Resume Analyzer</h2>
            <p className="text-gray-600">Get AI-powered suggestions to improve your resume</p>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF)
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <Upload className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Choose File</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {file && (
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {file.name}
              </span>
            )}
          </div>
        </div>

        {/* Resume Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Paste Resume Text
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          />
        </div>

        {/* Job Description (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description (Optional - for targeted analysis)
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description to get targeted suggestions..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !resumeText.trim()}
          className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Improvements */}
      {improvements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Suggested Improvements</h3>
          <div className="space-y-4">
            {improvements.map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-800 flex-1">{improvement}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

