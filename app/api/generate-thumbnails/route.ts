import { NextResponse } from "next/server";
import { generateScript } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, script } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `
    Generate 5 creative and high-CTR YouTube thumbnail ideas for the following:
    Topic: ${topic}
    ${script ? `Reference Script: ${script.substring(0, 1000)}...` : ""}

    For each idea, provide:
    1. Concept Name: A short, catchy name for the idea.
    2. Visual Description: A detailed description of what should be in the image (background, subject, colors, expressions).
    3. Text Overlay: The exact text that should appear on the thumbnail (if any).
    4. Why it Works: The psychological trigger or strategy behind this idea (curiosity, fear of missing out, authority, etc.).

    Format your response as a JSON array of objects with keys: "concept", "visualDescription", "textOverlay", "logic".
    Respond ONLY with the JSON array.
    `;

    const response = await generateScript(prompt);
    
    // Clean up response in case AI adds markdown formatting
    const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
        const thumbnailIdeas = JSON.parse(cleanedResponse);
        return NextResponse.json({
            success: true,
            ideas: thumbnailIdeas
        });
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError, cleanedResponse);
        // Fallback if AI fails to return clean JSON
        return NextResponse.json({
            success: false,
            error: "Failed to parse AI response into JSON",
            raw: cleanedResponse
        }, { status: 500 });
    }

  } catch (error) {
    console.error("THUMBNAIL GEN ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate thumbnail ideas" },
      { status: 500 }
    );
  }
}
