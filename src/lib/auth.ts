import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";

/**
 * Verifies that the current request has a valid, non-expired admin session
 * stored in MongoDB Atlas. Used by all protected API routes.
 */
export async function isAuthorized(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("techysaumya_session")?.value;
    if (!token) return false;

    await connectDB();
    const admin = await Admin.findOne({
      sessionToken: token,
      sessionExpiry: { $gt: new Date() },
    });

    return !!admin;
  } catch {
    return false;
  }
}
