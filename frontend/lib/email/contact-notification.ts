import type { ContactData } from "@/lib/schemas/contact";

interface NotificationEmail {
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
 * Build the notification email sent to the AEI team when someone submits
 * the contact form. Returns both HTML and plain-text versions.
 */
export function buildContactNotification(data: ContactData): NotificationEmail {
  const timestamp = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Jakarta",
    dateStyle: "long",
    timeStyle: "short",
  });

  const subject = data.organization
    ? `New inquiry from ${data.name} (${data.organization})`
    : `New inquiry from ${data.name}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;background:#f5f5f5;">
  <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
    <div style="background:#0a2540;padding:24px 32px;">
      <h1 style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">New Contact Inquiry</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#94a3b8;">${escapeHtml(timestamp)} (WIB)</p>
    </div>
    <div style="padding:24px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:10px 12px 10px 0;font-weight:600;color:#64748b;vertical-align:top;white-space:nowrap;">Name</td>
          <td style="padding:10px 0;">${escapeHtml(data.name)}</td>
        </tr>
        ${data.organization ? `
        <tr>
          <td style="padding:10px 12px 10px 0;font-weight:600;color:#64748b;vertical-align:top;white-space:nowrap;">Organization</td>
          <td style="padding:10px 0;">${escapeHtml(data.organization)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:10px 12px 10px 0;font-weight:600;color:#64748b;vertical-align:top;white-space:nowrap;">Email</td>
          <td style="padding:10px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color:#067bc2;">${escapeHtml(data.email)}</a></td>
        </tr>
        ${data.phone ? `
        <tr>
          <td style="padding:10px 12px 10px 0;font-weight:600;color:#64748b;vertical-align:top;white-space:nowrap;">Phone</td>
          <td style="padding:10px 0;"><a href="tel:${escapeHtml(data.phone)}" style="color:#067bc2;">${escapeHtml(data.phone)}</a></td>
        </tr>` : ""}
      </table>
      <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;font-weight:600;color:#64748b;font-size:13px;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
      Sent via the AEI website contact form
    </div>
  </div>
</body>
</html>`.trim();

  const text = [
    `New Contact Inquiry — ${timestamp} (WIB)`,
    "",
    `Name: ${data.name}`,
    data.organization ? `Organization: ${data.organization}` : null,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    "Message:",
    data.message,
    "",
    "---",
    "Sent via the AEI website contact form",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { subject, html, text };
}
