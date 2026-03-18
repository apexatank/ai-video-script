
export interface AppSettings {
  defaultLanguage: string;
  defaultStyle: string;
  apiKey?: string;
}

const SETTINGS_KEY = "youtube-script-settings";
const DEFAULT_SETTINGS: AppSettings = { defaultLanguage: "English", defaultStyle: "Educational" };

// --- Sync Functions (Local Storage) ---

export const getSettings = (): AppSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Async Functions (API with Local Storage Cache) ---

export const getSettingsAsync = async (): Promise<AppSettings> => {
  try {
    const response = await fetch("/api/settings");
    if (!response.ok) throw new Error("Failed to fetch settings");
    const data = await response.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return getSettings();
  }
};

export const saveSettingsAsync = async (settings: AppSettings): Promise<AppSettings> => {
  try {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error("Failed to save settings");
    const data = await response.json();
    
    // Sync to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("Error saving settings:", error);
    saveSettings(settings);
    return settings;
  }
};
