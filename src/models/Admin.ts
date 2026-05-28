import mongoose, { Schema, Document, Model } from "mongoose";
import { connectDB } from "@/lib/mongoose";

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  primaryEmail: string;
  recoveryEmail: string;
  sessionToken: string | null;
  sessionExpiry: Date | null;
  resetToken: string | null;       // SHA-256 hash of the plain token
  resetTokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username:         { type: String, required: true, unique: true, trim: true },
    passwordHash:     { type: String, required: true },
    primaryEmail:     { type: String, required: true, trim: true, lowercase: true, default: "admin@example.com" },
    recoveryEmail:    { type: String, required: true, trim: true, lowercase: true },
    sessionToken:     { type: String, default: null },
    sessionExpiry:    { type: Date,   default: null },
    resetToken:       { type: String, default: null },
    resetTokenExpiry: { type: Date,   default: null },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;

/**
 * Seeds the admin user from env vars on first run if none exists.
 * Called at login-time so it's always up-to-date.
 */
export async function ensureAdminExists(): Promise<void> {
  await connectDB();
  const username = process.env.ADMIN_USERNAME || "admin_sa";
  const admin = await Admin.findOne({ username });
  
  const primaryEmail  = process.env.ADMIN_PRIMARY_EMAIL  || process.env.ADMIN_RECOVERY_EMAIL || process.env.SMTP_EMAIL_USER || "admin@example.com";
  const recoveryEmail = process.env.ADMIN_RECOVERY_EMAIL || process.env.SMTP_EMAIL_USER || "admin@example.com";
  
  if (!admin) {
    const bcrypt = (await import("bcryptjs")).default;
    const password      = process.env.ADMIN_PASSWORD      || "1896@Sc";
    const passwordHash  = await bcrypt.hash(password, 12);
    await Admin.create({ username, passwordHash, primaryEmail, recoveryEmail });
    console.log(`✅ Admin user "${username}" seeded to MongoDB Atlas.`);
  } else if (!admin.primaryEmail) {
    // Fill backward-compatible field if missing
    admin.primaryEmail = primaryEmail;
    await admin.save();
    console.log(`✅ Admin user "${username}" updated with primary login email.`);
  }
}
