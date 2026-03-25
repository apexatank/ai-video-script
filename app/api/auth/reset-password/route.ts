import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password, token } = await request.json();

    if (!password || !token) {
      return NextResponse.json(
        { message: "Password and token are required" }, 
        { status: 400 }
      );
    }

    // Mock logic: Always succeed for any token
    console.log(`Password reset with token: ${token}`);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(
      { message: "Your password has been successfully updated." }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}
