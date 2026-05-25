import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "saumya123"; // High strength default

    if (username === expectedUsername && password === expectedPassword) {
      // Generate a secure hashed session token
      const sessionToken = crypto
        .createHash("sha256")
        .update(`${expectedUsername}-${expectedPassword}-${Date.now()}`)
        .digest("hex");

      const cookieStore = await cookies();
      
      // Store session securely in HTTP-only cookie
      cookieStore.set("techysaumya_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days persistence
        path: "/",
      });

      return NextResponse.json({ success: true, message: "Logged in successfully!" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid username or password credentials." },
      { status: 401 }
    );
  } catch (e) {
    console.error("Login API Error:", e);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

// Session validation route
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("techysaumya_session");

    if (session && session.value) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// Log out route
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("techysaumya_session");
    return NextResponse.json({ success: true, message: "Logged out." });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
