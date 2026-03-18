import { NextResponse } from "next/server";

// This is a mock database. In a real application, you would use a database like Prisma/Supabase.
let profileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  bio: "I create engaging scripts for tech-focused YouTube channels. Passionate about AI and storytelling.",
  role: "Product Designer & Content Creator"
};

export async function GET() {
  try {
    return NextResponse.json(profileData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate or update the data
    profileData = {
      ...profileData,
      ...body
    };

    return NextResponse.json(profileData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
