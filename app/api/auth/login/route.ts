import { NextResponse } from "next/server";

// This is a mock database. Mocking the logic as if it were a real auth.
// In a real app, you would use bcrypt for password hashing and a persistent DB.

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock login logic - for demo, we'll accept any password as "test" or just mock success
    // In a real scenario, you'd check against the registered users list.
    // However, since API route instances might restart in dev, we'll just mock success for any valid-looking input.
    
    if (email === "test@example.com" && password === "password") {
       return NextResponse.json(
        { 
          message: "Login successful", 
          user: { email, name: "Test User" },
          token: "mock-jwt-token" 
        },
        { status: 200 }
      );
    }

    // Defaulting to "Mock Success" for any login during demo to make it dynamic
    return NextResponse.json(
      { 
        message: "Login successful", 
        user: { email, name: email.split('@')[0] },
        token: "mock-jwt-token" 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
