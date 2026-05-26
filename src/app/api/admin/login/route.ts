import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import Admin, { ensureAdminExists } from "@/models/Admin";
import { isAuthorized } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await ensureAdminExists(); // Auto-seed if first run

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password credentials." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password credentials." },
        { status: 401 }
      );
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // 7 days expiry

    // Save session details to DB
    admin.sessionToken = token;
    admin.sessionExpiry = expiry;
    await admin.save();

    const cookieStore = await cookies();
    
    // Store session securely in HTTP-only cookie
    cookieStore.set("techysaumya_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Logged in successfully!" });
  } catch (e) {
    console.error("Login API Error:", e);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

// Session validation route
export async function GET() {
  try {
    const authenticated = await isAuthorized();
    if (authenticated) {
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
    const token = cookieStore.get("techysaumya_session")?.value;
    
    if (token) {
      await connectDB();
      await Admin.updateOne(
        { sessionToken: token },
        { $set: { sessionToken: null, sessionExpiry: null } }
      );
    }
    
    cookieStore.delete("techysaumya_session");
    return NextResponse.json({ success: true, message: "Logged out." });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
