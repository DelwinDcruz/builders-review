"use server";
import { signIn, AUTH_ENABLED } from "@/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email().max(254),
  next: z.string().startsWith("/").max(512).optional().default("/account"),
});

export type SignInState = { ok: boolean; message: string; sent?: boolean };

/** Send a secure magic-link sign-in email. Never reveals whether an account exists. */
export async function sendMagicLink(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (!AUTH_ENABLED) {
    return { ok: false, message: "Authentication is not configured on this environment yet." };
  }
  const parsed = schema.safeParse({
    email: formData.get("email"),
    next: formData.get("next") ?? "/account",
  });
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };

  try {
    await signIn("nodemailer", {
      email: parsed.data.email,
      redirect: false,
      redirectTo: parsed.data.next,
    });
    return { ok: true, sent: true, message: "Check your email for a secure sign-in link." };
  } catch {
    return { ok: false, message: "Could not send the sign-in link. Please try again." };
  }
}
