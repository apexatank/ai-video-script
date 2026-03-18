import { franc } from "franc";

export function detectLanguage(text: string) {
    const langCode = franc(text);

    const map: Record<string, string> = {
        eng: "English",
        hin: "Hindi",
        guj: "Gujarati",
        ben: "Bengali",
        mar: "Marathi",
        tam: "Tamil",
        tel: "Telugu",
    };

    return map[langCode] || "English";
}