
export interface ScriptItem {
  id: string;
  youtubeUrl: string;
  topic: string;
  style: string;
  script: string;
  date: string;
  language?: string;
  isBookmarked?: boolean;
}

const HISTORY_KEY = "youtube-script-history";

// --- Sync Functions (Local Storage) ---

export const getHistory = (): ScriptItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getBookmarks = (): ScriptItem[] => {
  return getHistory().filter(item => item.isBookmarked);
};

export const saveToHistory = (item: Omit<ScriptItem, "id" | "date">) => {
  const history = getHistory();
  const newItem: ScriptItem = {
    ...item,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const updatedHistory = [newItem, ...history];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return newItem;
};

export const toggleBookmark = (id: string) => {
  const history = getHistory();
  const updatedHistory = history.map((item) => 
    item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory.find(i => i.id === id);
};

export const deleteFromHistory = (id: string) => {
  const history = getHistory();
  const updatedHistory = history.filter((item) => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// --- Async Functions (API with Local Storage Cache) ---

export const getHistoryAsync = async (): Promise<ScriptItem[]> => {
  try {
    const response = await fetch("/api/history");
    if (!response.ok) throw new Error("Failed to fetch history");
    const data = await response.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("Error fetching history:", error);
    return getHistory();
  }
};

export const saveToHistoryAsync = async (item: Omit<ScriptItem, "id" | "date">): Promise<ScriptItem> => {
  try {
    const response = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Failed to save to history");
    const newItem = await response.json();
    
    // Sync to local storage
    const history = getHistory();
    localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem, ...history]));
    
    return newItem;
  } catch (error) {
    console.error("Error saving history:", error);
    return saveToHistory(item);
  }
};

export const toggleBookmarkAsync = async (id: string, currentStatus: boolean): Promise<ScriptItem | undefined> => {
  try {
    const response = await fetch("/api/history", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isBookmarked: !currentStatus }),
    });
    if (!response.ok) throw new Error("Failed to toggle bookmark");
    const updatedItem = await response.json();
    
    // Sync to local storage
    const history = getHistory();
    const updatedHistory = history.map(item => item.id === id ? updatedItem : item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    return updatedItem;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return toggleBookmark(id);
  }
};

export const deleteFromHistoryAsync = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/history?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete from history");
    
    // Sync to local storage
    deleteFromHistory(id);
  } catch (error) {
    console.error("Error deleting from history:", error);
    deleteFromHistory(id);
  }
};

export const clearHistoryAsync = async (): Promise<void> => {
  try {
    const response = await fetch("/api/history", {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to clear history");
    
    // Sync to local storage
    clearHistory();
  } catch (error) {
    console.error("Error clearing history:", error);
    clearHistory();
  }
};
