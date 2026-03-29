import { z } from "zod";

/** Strip HTML tags from a string to prevent injection in emails. */
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .transform(stripHtml),
  organization: z
    .string()
    .transform(stripHtml)
    .default(""),
  email: z
    .string()
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .transform(stripHtml)
    .default(""),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters.")
    .max(2000, "Message must be under 2000 characters.")
    .transform(stripHtml),
});

export type ContactData = z.infer<typeof contactSchema>;

/**
 * Parse and validate contact form data.
 * Returns either the validated + sanitized data or a map of field errors.
 */
export function parseContactForm(data: unknown):
  | { success: true; data: ContactData }
  | { success: false; errors: Record<string, string> } {
  const result = contactSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}
