import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a professional resume reviewer. Analyze the following resume and provide exactly 3 specific, actionable improvements.

${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ""}Resume Text:\n${resumeText}\n\n

Provide exactly 3 improvements in this format:
1. [Improvement 1]
2. [Improvement 2]
3. [Improvement 3]

Be specific and actionable. Focus on content, keywords, and alignment with the job description if provided.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the improvements
    const improvements = text
      .split(/\d+\./)
      .filter((item) => item.trim())
      .map((item) => item.trim())
      .slice(0, 3);

    return NextResponse.json({ improvements });
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume", details: error.message },
      { status: 500 }
    );
  }
}

