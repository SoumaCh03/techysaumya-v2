import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { createTransporter, buildEmailHtml } from "@/lib/mail";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    
    // 1. IP Rate Limiting: Max 3 OTP requests per 15 minutes to prevent spam
    const limitResult = rateLimit(ip, 3, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: `Too many recovery requests. Please try again in ${limitResult.reset} seconds.` },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    await connectDB();
    const admin = await Admin.findOne({
      recoveryEmail: sanitizedEmail,
    });

    // 2. Prevent Enumeration: Return successful response even if email is not found
    if (!admin) {
      console.warn(`[AUDIT] Forgot credentials request for non-existent email: "${sanitizedEmail}" from IP ${ip}`);
      return NextResponse.json({
        success: true,
        message: "If that email is registered, recovery instructions have been sent.",
      });
    }

    // 3. Resend Frequency Limit: 60 seconds cooldown using resetTokenExpiry
    if (admin.resetTokenExpiry) {
      const timeToExpiry = admin.resetTokenExpiry.getTime() - Date.now();
      const cooldownThreshold = 4 * 60 * 1000; // 5 min - 1 min = 4 min remaining
      if (timeToExpiry > cooldownThreshold) {
        const waitSeconds = Math.ceil((timeToExpiry - cooldownThreshold) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitSeconds} seconds before requesting another code.` },
          { status: 429 }
        );
      }
    }

    // 4. Cryptographically Secure OTP generation: 6 digits (100000 - 999999)
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Invalidate previous OTPs by overriding
    admin.resetToken = hashedOtp;
    admin.resetTokenExpiry = expiry;
    await admin.save();

    // 5. Send OTP via Nodemailer
    const transporter = createTransporter();
    const emailHtml = buildEmailHtml(
      "Admin Account Recovery Code",
      `
      <p>Hello Admin,</p>
      <p>A request was made to recover credentials for the TechySaumya administration portal.</p>
      <p>Use the following 6-digit OTP code to verify your identity. This code is valid for <strong>5 minutes</strong> and can only be used once.</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #00F0FF; background: rgba(0,240,255,0.05); padding: 12px 24px; border-radius: 12px; border: 1px solid rgba(0,240,255,0.25); display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 13px; color: #8e8e93;">If you did not make this request, you can safely ignore this email. Ensure your email account is secure.</p>
      `
    );

    await transporter.sendMail({
      from: `"TechySaumya Admin" <${process.env.SMTP_EMAIL_USER}>`,
      to: admin.recoveryEmail,
      subject: "TechySaumya Admin - Account Recovery OTP",
      html: emailHtml,
    });

    console.log(`[AUDIT] OTP generated and sent to recovery email for admin "${admin.username}" from IP ${ip}`);

    return NextResponse.json({
      success: true,
      message: "If that email is registered, recovery instructions have been sent.",
    });
  } catch (e) {
    console.error("Forgot Credentials OTP Request Error:", e);
    return NextResponse.json({ error: "Failed to process recovery request." }, { status: 500 });
  }
}
