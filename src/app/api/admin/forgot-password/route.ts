import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { createTransporter, buildEmailHtml } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();
    const admin = await Admin.findOne({
      recoveryEmail: email.toLowerCase().trim(),
    });

    // For security and privacy, we return a successful response even if the email wasn't found.
    // However, since this is a personal site with 1 admin, we can log a warning or return success.
    if (!admin) {
      return NextResponse.json({
        success: true,
        message: "If that email is registered, a password reset link has been sent.",
      });
    }

    // Generate token and expiry
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    admin.resetToken = hashedToken;
    admin.resetTokenExpiry = expiry;
    await admin.save();

    // Prepare reset email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/admin?reset=${rawToken}`;
    const transporter = createTransporter();

    const emailHtml = buildEmailHtml(
      "Password Reset Request",
      `
      <p>Hello Admin,</p>
      <p>A request has been made to reset the password for your TechySaumya admin account.</p>
      <p>Please click the link below to reset your password. This link is valid for <strong>1 hour</strong>.</p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #00F0FF; color: #050505; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 13px; color: #8e8e93;">If the button doesn't work, copy and paste the following URL into your browser:</p>
      <p style="font-size: 13px; color: #00F0FF; word-break: break-all;">${resetUrl}</p>
      <p style="font-size: 13px; color: #8e8e93;">If you did not request this, you can safely ignore this email.</p>
      `
    );

    await transporter.sendMail({
      from: `"TechySaumya Admin" <${process.env.SMTP_EMAIL_USER}>`,
      to: admin.recoveryEmail,
      subject: "TechySaumya Admin - Reset Your Password",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "If that email is registered, a password reset link has been sent.",
    });
  } catch (e) {
    console.error("Forgot Password API Error:", e);
    return NextResponse.json({ error: "Failed to process forgot password request." }, { status: 500 });
  }
}
