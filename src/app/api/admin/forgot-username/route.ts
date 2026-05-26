import { NextResponse } from "next/server";
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

    // Return generic success to avoid enumeration
    if (!admin) {
      return NextResponse.json({
        success: true,
        message: "If that email is registered, your username details have been sent.",
      });
    }

    const transporter = createTransporter();
    const emailHtml = buildEmailHtml(
      "Username Recovery",
      `
      <p>Hello Admin,</p>
      <p>A request was made to retrieve the username for your TechySaumya account.</p>
      <p>Your admin username is: <strong style="color: #00F0FF; font-size: 16px;">${admin.username}</strong></p>
      <p style="margin-top: 24px;">You can now return to the login panel and log in with this username.</p>
      `
    );

    await transporter.sendMail({
      from: `"TechySaumya Admin" <${process.env.SMTP_EMAIL_USER}>`,
      to: admin.recoveryEmail,
      subject: "TechySaumya Admin - Username Recovery",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "If that email is registered, your username details have been sent.",
    });
  } catch (e) {
    console.error("Forgot Username API Error:", e);
    return NextResponse.json({ error: "Failed to process forgot username request." }, { status: 500 });
  }
}
