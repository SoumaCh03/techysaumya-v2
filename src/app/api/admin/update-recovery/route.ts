import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { isAuthorized } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    
    // Protect against brute force attempts on password verification
    const limitResult = rateLimit(ip, 5, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${limitResult.reset} seconds.` },
        { status: 429 }
      );
    }

    const { currentPassword, primaryEmail, recoveryEmail } = await req.json();

    if (!currentPassword || !primaryEmail || !recoveryEmail) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(primaryEmail) || !emailRegex.test(recoveryEmail)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    const sanitizedPrimary = primaryEmail.toLowerCase().trim();
    const sanitizedRecovery = recoveryEmail.toLowerCase().trim();

    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("techysaumya_session")?.value;
    
    const admin = await Admin.findOne({ sessionToken: token });
    if (!admin) {
      return NextResponse.json({ error: "Admin session not found." }, { status: 404 });
    }

    // Check password matches to authorize changes
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      console.warn(`[AUDIT] Failed recovery details update attempt for admin "${admin.username}" from IP ${ip}: Incorrect password.`);
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    // Update emails
    admin.primaryEmail = sanitizedPrimary;
    admin.recoveryEmail = sanitizedRecovery;
    await admin.save();

    console.log(`[AUDIT] Recovery details successfully updated for admin "${admin.username}" from IP ${ip}. Primary: ${sanitizedPrimary}, Recovery: ${sanitizedRecovery}`);

    return NextResponse.json({ 
      success: true, 
      message: "Recovery information updated successfully.",
      primaryEmail: sanitizedPrimary,
      recoveryEmail: sanitizedRecovery
    });
  } catch (e) {
    console.error("Update Recovery API Error:", e);
    return NextResponse.json({ error: "Failed to update recovery settings." }, { status: 500 });
  }
}
