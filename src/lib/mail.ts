import nodemailer from "nodemailer";

/**
 * Shared nodemailer transporter using Gmail SMTP with STARTTLS.
 * Reads credentials from environment variables set in .env.local
 */
export function createTransporter() {
  return nodemailer.createTransport({
    host:       process.env.SMTP_EMAIL_HOST || "smtp.gmail.com",
    port:       parseInt(process.env.SMTP_EMAIL_PORT || "587", 10),
    secure:     false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASS,
    },
  });
}

/** Branded HTML email wrapper */
export function buildEmailHtml(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:Arial,sans-serif;background:#050505;color:#f5f5f7;padding:36px;border-radius:16px;border:1px solid rgba(255,255,255,0.05);max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;border-bottom:1px solid rgba(0,240,255,0.15);padding-bottom:16px;">
        <span style="font-size:20px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">TechySaumya<span style="color:#00F0FF;">v2</span></span>
        <span style="font-size:11px;background:rgba(0,240,255,0.1);color:#00F0FF;padding:2px 8px;border-radius:999px;border:1px solid rgba(0,240,255,0.2);letter-spacing:1px;text-transform:uppercase;">Admin</span>
      </div>
      <h2 style="color:#00F0FF;font-size:18px;font-weight:700;margin:0 0 16px 0;">${title}</h2>
      ${bodyHtml}
      <p style="font-size:11px;color:#8e8e93;margin-top:28px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;">
        Sent by TechySaumya Portfolio Admin System — Do not share this email.
      </p>
    </div>
  `;
}
