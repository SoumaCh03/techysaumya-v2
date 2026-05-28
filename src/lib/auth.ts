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

/**
 * Validates password strength policy:
 * - minimum 12 characters
 * - uppercase required
 * - lowercase required
 * - number required
 * - special character required
 * - reject weak/common passwords
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 12) {
    return { valid: false, error: "Password must be at least 12 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number." };
  }
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character." };
  }

  const weakPatterns = ["password", "123456", "admin", "welcome", "qwerty", "techysaumya", "saumyadeep"];
  const lowerPassword = password.toLowerCase();
  if (weakPatterns.some((pattern) => lowerPassword.includes(pattern))) {
    return { valid: false, error: "Password is too weak or common. Please choose a more complex one." };
  }

  return { valid: true };
}
