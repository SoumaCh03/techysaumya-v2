import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";

// 1. GET: Validate if a reset token is still valid and not expired
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token is required." }, { status: 400 });
    }

    await connectDB();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!admin) {
      return NextResponse.json({ valid: false, error: "Invalid or expired token." }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
  } catch (e) {
    console.error("Validate Reset Token Error:", e);
    return NextResponse.json({ valid: false, error: "Server error." }, { status: 500 });
  }
}

// 2. POST: Complete the password reset with a new password
export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    await connectDB();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    // Hash the new password and clear the reset token
    const salt = await bcrypt.genSalt(12);
    admin.passwordHash = await bcrypt.hash(password, salt);
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    
    // Invalidate active session so they log in fresh
    admin.sessionToken = null;
    admin.sessionExpiry = null;

    await admin.save();

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (e) {
    console.error("Complete Reset Password Error:", e);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
