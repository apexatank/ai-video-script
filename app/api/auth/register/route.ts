import { NextResponse } from "next/server";

// This is a mock database for demonstration purposes.
// In a real application, you would use a persistent database.
const users: any[] = [];

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock check for existing user
    if (users.find(u => u.email === email)) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Mock save user
    const newUser = { id: Date.now().toString(), email, password, name };
    users.push(newUser);

    return NextResponse.json(
      { message: "Registration successful", user: { email, name } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
