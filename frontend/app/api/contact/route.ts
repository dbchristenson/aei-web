import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { parseContactForm } from "@/lib/schemas/contact";
import { buildContactNotification } from "@/lib/email/contact-notification";
import { buildContactConfirmation } from "@/lib/email/contact-confirmation";
import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO ?? "contact@aei-1.com";
const CONTACT_EMAIL_FROM =
  process.env.CONTACT_EMAIL_FROM ?? "AEI Website <noreply@aei-mail.com>";

export async function POST(request: NextRequest) {
  // --- Content-Type check ---
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 }
    );
  }

  // --- Parse JSON body ---
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // --- Honeypot check (before Zod strips unknown fields) ---
  if (
    typeof body === "object" &&
    body !== null &&
    "_honey" in body &&
    (body as Record<string, unknown>)._honey
  ) {
    // Silent accept — don't reveal to bots that we caught them
    return NextResponse.json({ status: "ok" });
  }

  // --- Rate limiting ---
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() ?? "unknown";

  try {
    const { success: withinLimit } = await rateLimit(ip);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  } catch (err) {
    // Rate limiter failure should not block the form — log and continue
    console.error("[contact] Rate limiter error:", err);
  }

  // --- Validate + sanitize ---
  const parsed = parseContactForm(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", fields: parsed.errors },
      { status: 422 }
    );
  }

  // --- Send email ---
  const notification = buildContactNotification(parsed.data);

  if (!process.env.RESEND_API_KEY) {
    console.warn("[contact] RESEND_API_KEY not set — skipping email send.");
    console.log("[contact] Would have sent:", notification.subject);
    return NextResponse.json({ status: "ok" });
  }

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_EMAIL_FROM,
      to: CONTACT_EMAIL_TO,
      replyTo: parsed.data.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    if (error) {
      console.error("[contact] Resend API error:", error);
      return NextResponse.json(
        {
          error:
            "Something went wrong. Please email us directly at contact@aei-1.com.",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong. Please email us directly at contact@aei-1.com.",
      },
      { status: 500 }
    );
  }

  // --- Send confirmation email to submitter (best-effort, non-blocking) ---
  const confirmation = buildContactConfirmation(parsed.data);

  try {
    const { error: confirmErr } = await resend.emails.send({
      from: CONTACT_EMAIL_FROM,
      to: parsed.data.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });

    if (confirmErr) {
      console.error("[contact] Confirmation email error:", confirmErr);
    }
  } catch (err) {
    console.error("[contact] Failed to send confirmation email:", err);
  }

  return NextResponse.json({ status: "ok" });
}
