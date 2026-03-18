import { NextResponse } from "next/server";
import { generateScript } from "@/lib/gemini";
import { getTranscript } from "@/lib/youtube";

/**
 * Extract YouTube video ID
 */
function extractVideoId(url: string) {
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { youtubeUrl, topic, style, language } = body;

    let transcriptText = "";

    /**
     * Step 1: Get transcript if YouTube URL provided
     */
    if (youtubeUrl) {
      const videoId = extractVideoId(youtubeUrl);

      if (videoId) {
        const transcript = await getTranscript(videoId);

        if (transcript) {
          transcriptText = transcript;
        } else {
          console.log("Transcript not available");
        }
      }
    }

    /**
     * Step 2: Build AI prompt
     */
    // for transcript-based script generation:
    //     const prompt = `
    // Create a professional YouTube video script in the SAME language as the reference transcript.

    // Topic: ${topic}

    // Style: ${style || "engaging and educational"}

    // Reference Transcript:
    // ${transcriptText || "No transcript available"}

    // Instructions:
    // - Detect the language of the transcript
    // - Generate the script in the same language
    // - Make it engaging for YouTube viewers
    // - Include hook, introduction, main content and ending
    // - Make it natural and conversational
    // `;
    // for language selection feature, use this prompt instead:
    const prompt = `
    Create a professional YouTube video script in ${language || "English"} language.

    Topic: ${topic}

    Style: ${style || "engaging and educational"}
    Target Audience: ${body.audience || "General Public"}
    Desired Length: ${body.length || "Medium"}

    Reference Transcript:
    ${transcriptText || "No transcript available"}

    Instructions:
    - Script must be in ${language || "English"} language
    - Target the audience: ${body.audience || "General Public"}
    - Aim for a length equivalent to ${body.length || "Medium"}
    - Make it engaging for YouTube viewers
    - Include hook, introduction, main content and ending
    - Make it natural and conversational
    `;

    /**
     * Step 3: Generate script using AI
     */
    const script = await generateScript(prompt);
    return NextResponse.json({
      success: true,
      script,
      transcript: transcriptText,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Script generation failed",
      },
      { status: 500 },
    );
  }
}
