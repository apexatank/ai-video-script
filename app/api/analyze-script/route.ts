import { NextResponse } from "next/server";
import { generateScript } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { script, topic } = body;

    if (!script) {
      return NextResponse.json({ error: "Script content is required" }, { status: 400 });
    }

    const prompt = `
    Analyze the following YouTube video script and provide a comprehensive performance score.
    Topic: ${topic || "Not specified"}
    Script Content: ${script.substring(0, 4000)}

    Provide a JSON response with the following structure:
    {
      "overallScore": number (0-100),
      "metrics": [
        { "name": "Engagement", "score": number (0-100), "feedback": "string" },
        { "name": "Pacing", "score": number (0-100), "feedback": "string" },
        { "name": "Clarity", "score": number (0-100), "feedback": "string" },
        { "name": "SEO", "score": number (0-100), "feedback": "string" }
      ],
      "strengths": ["string", "string", ...],
      "weaknesses": ["string", "string", ...],
      "suggestions": ["string", "string", ...]
    }

    Respond ONLY with the JSON.
    `;

    const response = await generateScript(prompt);
    const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
        const analysis = JSON.parse(cleanedResponse);
        return NextResponse.json({
            success: true,
            analysis
        });
    } catch (parseError) {
        console.error("Analysis Parse Error:", parseError, cleanedResponse);
        return NextResponse.json({
            success: false,
            error: "Failed to parse analysis results",
            raw: cleanedResponse
        }, { status: 500 });
    }
  } catch (error) {
    console.error("ANALYSIS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze script" },
      { status: 500 }
    );
  }
}
