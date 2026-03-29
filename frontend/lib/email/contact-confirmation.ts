import type { ContactData } from "@/lib/schemas/contact";

interface ConfirmationEmail {
  subject: string;
  html: string;
  text: string;
}

/** Escape HTML special characters to prevent rendering issues in the email. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build the confirmation email sent to the person who submitted the
 * contact form. Acknowledges their inquiry and sets response-time
 * expectations. Returns both HTML and plain-text versions.
 */
export function buildContactConfirmation(data: ContactData): ConfirmationEmail {
  const firstName = data.name.split(" ")[0];

  const subject = "We received your inquiry — PT Agra Energi Indonesia";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;background:#f5f5f5;">
  <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
    <div style="background:#0a2540;padding:24px 32px;">
      <h1 style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">PT Agra Energi Indonesia</h1>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Dear ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Thank you for reaching out. We have received your inquiry and a member of our team will review it shortly.</p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">We typically respond within <strong>2 business days</strong>. If your matter is urgent, please contact us directly at <a href="mailto:contact@aei-1.com" style="color:#067bc2;">contact@aei-1.com</a>.</p>
      <div style="padding:16px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;font-weight:600;color:#64748b;font-size:13px;">Your message</p>
        <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#334155;">${escapeHtml(data.message)}</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;line-height:1.5;">
      You are receiving this email because a contact form was submitted on the AEI website with this email address. If you did not submit this form, you can safely ignore this message.
    </div>
  </div>
</body>
</html>`.trim();

  const text = [
    `Dear ${firstName},`,
    "",
    "Thank you for reaching out to PT Agra Energi Indonesia. We have received your inquiry and a member of our team will review it shortly.",
    "",
    "We typically respond within 2 business days. If your matter is urgent, please contact us directly at contact@aei-1.com.",
    "",
    "--- Your message ---",
    data.message,
    "---",
    "",
    "You are receiving this email because a contact form was submitted on the AEI website with this email address. If you did not submit this form, you can safely ignore this message.",
  ].join("\n");

  return { subject, html, text };
}
