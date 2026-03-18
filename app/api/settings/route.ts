import { NextResponse } from "next/server";

// Mock database for settings
let settingsData = {
  defaultLanguage: "English",
  defaultStyle: "Educational",
  apiKey: ""
};

export async function GET() {
  try {
    return NextResponse.json(settingsData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    settingsData = {
      ...settingsData,
      ...body
    };
    return NextResponse.json(settingsData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
