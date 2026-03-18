export async function generateScript(prompt: string) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "youtube-script-ai",
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3-8b-instruct",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        }),
    });

    const data = await response.json();

    console.log("OpenRouter response:", data);

    if (!data.choices || !data.choices.length) {
        throw new Error(data.error?.message || "AI response invalid");
    }

    return data.choices[0].message.content;
}