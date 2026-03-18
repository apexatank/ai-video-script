import { NextResponse } from "next/server";
import { generateScript } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, audience, length } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `
    Generate 7 high-impact YouTube video hooks for the following:
    Topic: ${topic}
    Target Audience: ${audience || "General Public"}
    Estimated Video Length: ${length || "Medium"}

    For each hook, provide:
    1. Hook Type: (e.g., The Question, The Bold Statement, The Story Start, The Negative Constraint, The Secret, The Statistical Fact, The "What If").
    2. Script Content: The exact word-for-word opening lines (first 15-30 seconds).
    3. Retention Strategy: Why this hook will prevent viewers from clicking away.

    Format your response as a JSON array of objects with keys: "type", "content", "strategy".
    Respond ONLY with the JSON array.
    `;

    const response = await generateScript(prompt);
    
    // Clean up response in case AI adds markdown formatting
    const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
        const hooks = JSON.parse(cleanedResponse);
        return NextResponse.json({
            success: true,
            hooks: hooks
        });
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError, cleanedResponse);
        return NextResponse.json({
            success: false,
            error: "Failed to parse AI response into JSON",
            raw: cleanedResponse
        }, { status: 500 });
    }

  } catch (error) {
    console.error("HOOK GEN ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate video hooks" },
      { status: 500 }
    );
  }
}
