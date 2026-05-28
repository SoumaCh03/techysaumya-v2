import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { isAuthorized, validatePasswordStrength } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    
    // Protect against brute force on current password
    const limitResult = rateLimit(ip, 5, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${limitResult.reset} seconds.` },
        { status: 429 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    // Password strength check
    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.error }, { status: 400 });
    }

    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("techysaumya_session")?.value;
    
    const admin = await Admin.findOne({ sessionToken: token });
    if (!admin) {
      return NextResponse.json({ error: "Admin session not found." }, { status: 404 });
    }

    // Check current password matches
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      console.warn(`[AUDIT] Failed password change attempt for admin "${admin.username}" from IP ${ip}: Incorrect current password.`);
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Invalidate session
    admin.sessionToken = null;
    admin.sessionExpiry = null;
    await admin.save();

    // Clear session cookie
    cookieStore.delete("techysaumya_session");

    console.log(`[AUDIT] Password successfully changed for admin "${admin.username}" from IP ${ip}. Active session invalidated.`);

    return NextResponse.json({ success: true, message: "Password updated successfully. Please log in again." });
  } catch (e) {
    console.error("Change Password API Error:", e);
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}
