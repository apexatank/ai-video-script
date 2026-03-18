import { NextResponse } from "next/server";
import { generateScript } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { script, topic } = await req.json();

    if (!script && !topic) {
      return NextResponse.json(
        { success: false, error: "Missing script or topic" },
        { status: 400 }
      );
    }

    const prompt = `
    Based on the following script or topic, generate a comprehensive SEO and metadata package for a YouTube video.
    
    Topic/Focus: ${topic || "General"}
    Script Context: ${script ? script.substring(0, 2000) : "N/A"}
    
    Provide the response in the following structured format (use clear headings):
    
    1. 🚀 TITLES: Provide 5 different catchy, click-worthy titles.
    2. 📝 DESCRIPTION: Provide an SEO-optimized video description (around 200 words).
    3. 🏷️ TAGS: Provide a list of 15-20 relevant tags.
    4. 🖼️ THUMBNAIL CONCEPTS: Provide 3 visual concepts with text overlays.
    5. 📱 SOCIAL MEDIA PACK: 
       - A catchy Twitter (X) thread (3-4 tweets summarize the video).
       - A professional LinkedIn post.
       - An engaging Instagram/TikTok caption.
    6. 🔑 KEYWORDS: 10 primary keywords.

    Make sure the tone is professional and optimized for viral growth.
    `;

    const result = await generateScript(prompt);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("SEO ASSISTANT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "SEO analysis failed" },
      { status: 500 }
    );
  }
}
