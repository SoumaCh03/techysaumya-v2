import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

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

    // Initialize SMTP Transporter for Google Mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Compile email template
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: smtpUser, // Send mail to self
      subject: `[Portfolio Connect] ${subject} - from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #050505; color: #f5f5f7; padding: 30px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00F0FF; border-bottom: 1px solid rgba(0, 240, 255, 0.15); padding-bottom: 10px; margin-top: 0;">New Portfolio Message</h2>
          <p style="font-size: 14px; margin-bottom: 8px;"><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
          <p style="font-size: 14px; margin-bottom: 20px;"><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #0b0b0b; border: 1px solid rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #e8f4ff; margin-bottom: 20px;">
            <strong>Message:</strong><br />
            ${message.replace(/\n/g, "<br />")}
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
