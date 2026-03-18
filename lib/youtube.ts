export async function getTranscript(videoId: string) {
    try {
        const response = await fetch(
            `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}`,
            {
                headers: {
                    "x-api-key": process.env.SUPADATA_API_KEY || "",
                },
            }
        );

        const data = await response.json();

        console.log("SUPADATA RESPONSE:", data);

        const transcriptArray = data?.transcript || data?.content;

        if (!transcriptArray) return "";

        return transcriptArray.map((item: { text: string }) => item.text).join(" ");
    } catch (error) {
        console.error("Transcript error:", error);
        return "";
    }
}