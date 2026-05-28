import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { validatePasswordStrength } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";

    // 1. IP Rate Limiting: Max 5 attempts per 15 minutes to prevent OTP brute-forcing
    const limitResult = rateLimit(ip, 5, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${limitResult.reset} seconds.` },
        { status: 429 }
      );
    }

    const { email, otp, newPassword, confirmPassword, type } = await req.json();

    if (!email || !otp || !type) {
      return NextResponse.json({ error: "Email, OTP code, and action type are required." }, { status: 400 });
    }

    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedOtp = otp.trim();

    await connectDB();
    const admin = await Admin.findOne({ recoveryEmail: sanitizedEmail });

    // Prevent verification side-channel enumeration
    if (!admin) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    // Verify OTP matches stored SHA-256 hash
    const hashedSubmittedOtp = crypto.createHash("sha256").update(sanitizedOtp).digest("hex");
    const isOtpValid = admin.resetToken === hashedSubmittedOtp;
    const isExpired = !admin.resetTokenExpiry || admin.resetTokenExpiry.getTime() < Date.now();

    if (!isOtpValid || isExpired) {
      console.warn(`[AUDIT] Failed OTP verification attempt for email "${sanitizedEmail}" from IP ${ip}. Valid: ${isOtpValid}, Expired: ${isExpired}`);
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    // --- CASE A: Verification Only (Username Recovery / Unlock Reset Screen) ---
    if (type === "verify") {
      console.log(`[AUDIT] Successful OTP verification for email "${sanitizedEmail}" from IP ${ip}. Username retrieved.`);
      return NextResponse.json({
        success: true,
        username: admin.username, // Returns username as requested in credential recovery options
      });
    }

    // --- CASE B: Reset Password Execution ---
    if (type === "reset") {
      if (!newPassword || !confirmPassword) {
        return NextResponse.json({ error: "Password fields are required." }, { status: 400 });
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
      }

      // Strong password validation
      const strength = validatePasswordStrength(newPassword);
      if (!strength.valid) {
        return NextResponse.json({ error: strength.error }, { status: 400 });
      }

      // Hash the new password and clear recovery tokens
      const salt = await bcrypt.genSalt(12);
      admin.passwordHash = await bcrypt.hash(newPassword, salt);
      admin.resetToken = null;
      admin.resetTokenExpiry = null;
      
      // Invalidate active session so they log in fresh
      admin.sessionToken = null;
      admin.sessionExpiry = null;
      
      await admin.save();

      console.log(`[AUDIT] Password successfully reset via OTP for admin account "${admin.username}" from IP ${ip}. All active sessions invalidated.`);

      return NextResponse.json({
        success: true,
        message: "Credentials updated successfully. Please log in with your new password.",
      });
    }

    return NextResponse.json({ error: "Invalid action type." }, { status: 400 });
  } catch (e) {
    console.error("OTP Recovery Verification Error:", e);
    return NextResponse.json({ error: "Failed to process verification." }, { status: 500 });
  }
}
