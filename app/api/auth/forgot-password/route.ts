import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" }, 
        { status: 400 }
      );
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { message: "Email service not configured (GMAIL_USER or GMAIL_APP_PASSWORD missing)" }, 
        { status: 500 }
      );
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetUrl = `${protocol}://${host}/reset-password?token=${resetToken}`;

    // Send actual email using Nodemailer
    await transporter.sendMail({
      from: `"ScriptAI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your ScriptAI password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 16px;">Reset your password</h1>
          <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
            Someone requested a password reset for your ScriptAI account. If this was you, click the button below to set a new password.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #e11d48; color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
            Reset Password
          </a>
          <p style="color: #64748b; font-size: 14px;">
            If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">
            © 2026 ScriptAI. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log(`Password reset email sent (via Gmail) to: ${email}`);

    return NextResponse.json(
      { message: "Recovery email sent successfully." }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}
