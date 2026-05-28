import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import Admin, { ensureAdminExists } from "@/models/Admin";
import { isAuthorized } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    await ensureAdminExists(); // Auto-seed if first run

    // 1. IP-based rate limiting (5 attempts per 15 minutes)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    
    const limitResult = rateLimit(ip, 5, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Too many login attempts. Please try again in ${limitResult.reset} seconds.` 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": limitResult.reset.toString()
          }
        }
      );
    }

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
    const cookieStore = await cookies();
    const token = cookieStore.get("techysaumya_session")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await connectDB();
    const admin = await Admin.findOne({
      sessionToken: token,
      sessionExpiry: { $gt: new Date() },
    });

    if (admin) {
      return NextResponse.json({ authenticated: true, recoveryEmail: admin.recoveryEmail });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
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
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
