
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  role: string;
}

const PROFILE_KEY = "youtube-script-profile";

const DEFAULT_PROFILE: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  bio: "I create engaging scripts for tech-focused YouTube channels. Passionate about AI and storytelling.",
  role: "Product Designer & Content Creator"
};


export const getProfile = (): UserProfile => {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfileAsync = async (): Promise<UserProfile> => {
  try {
    const response = await fetch("/api/profile");
    if (!response.ok) throw new Error("Failed to fetch profile");
    const data = await response.json();
    // Cache to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("Error fetching profile from API:", error);
    return getProfile(); // Fallback to local storage
  }
};

export const saveProfileAsync = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error("Failed to save profile");
    const data = await response.json();
    // Update localStorage
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error saving profile to API:", error);
    saveProfile(profile); // Fallback to local storage
    return profile;
  }
};
