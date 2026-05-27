import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";
import { escapeHtml } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    // 1. IP-based rate limiting (3 submissions per 5 minutes)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    
    const limitResult = rateLimit(ip, 3, 5 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, error: `Too many messages sent. Please try again in ${limitResult.reset} seconds.` },
        { 
          status: 429,
          headers: {
            "Retry-After": limitResult.reset.toString()
          }
        }
      );
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // 2. Escape input fields to prevent HTML injection in email client
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedSubject = escapeHtml(subject);
    const escapedMessage = escapeHtml(message).replace(/\n/g, "<br />");

    const smtpHost = process.env.SMTP_EMAIL_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_EMAIL_PORT || "587", 10);
    const smtpUser = process.env.SMTP_EMAIL_USER;
    const smtpPass = process.env.SMTP_EMAIL_PASS;

    // Check if SMTP environment is configured
    if (!smtpUser || !smtpPass) {
      console.warn("SMTP email parameters are not configured. Returning local mock success flag for EmailJS fallback.");
      return NextResponse.json({
        success: true,
        fallbackToClient: true,
        message: "SMTP keys not found. Falling back to client-side EmailJS."
      });
    }

    // Initialize SMTP Transporter — port 587 with STARTTLS
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,      // false = STARTTLS on port 587
      requireTLS: true,   // force upgrade to TLS
      auth: {
        user: smtpUser,
        pass: smtpPass,   // Gmail App Password (16 chars)
      },
    });

    // Compile email template using sanitized values
    const mailOptions = {
      from: `"${escapedName}" <${escapedEmail}>`,
      to: smtpUser, // Send mail to self
      subject: `[Portfolio Connect] ${escapedSubject} - from ${escapedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #050505; color: #f5f5f7; padding: 30px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00F0FF; border-bottom: 1px solid rgba(0, 240, 255, 0.15); padding-bottom: 10px; margin-top: 0;">New Portfolio Message</h2>
          <p style="font-size: 14px; margin-bottom: 8px;"><strong>From:</strong> ${escapedName} (&lt;${escapedEmail}&gt;)</p>
          <p style="font-size: 14px; margin-bottom: 20px;"><strong>Subject:</strong> ${escapedSubject}</p>
          <div style="background-color: #0b0b0b; border: 1px solid rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #e8f4ff; margin-bottom: 20px;">
            <strong>Message:</strong><br />
            ${escapedMessage}
          </div>
          <p style="font-size: 11px; color: #8e8e93; margin-top: 20px; text-align: center; border-t: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">
            Sent dynamically from TechySaumya v2 Portfolio website.
          </p>
        </div>
      `,
    };

    // Dispatch email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Thank you! Message dispatched successfully." });
  } catch (e) {
    console.error("Mailing API Server Error:", e);
    return NextResponse.json(
      { success: false, error: "Server failed to send email." },
      { status: 500 }
    );
  }
}
