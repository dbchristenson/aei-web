"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormFields {
  name: string;
  organization: string;
  email: string;
  phone: string;
  message: string;
  _honey: string;
}

const inputClass =
  "w-full bg-surface border border-border rounded-[var(--radius-button)] px-4 py-3 text-fg font-body text-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const inputErrorClass =
  "w-full bg-surface border border-error rounded-[var(--radius-button)] px-4 py-3 text-fg font-body text-body focus:outline-none focus:border-error focus:ring-2 focus:ring-error/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-error text-xs font-body" role="alert">
      {message}
    </p>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<FormFields>({
    name: "",
    organization: "",
    email: "",
    phone: "",
    message: "",
    _honey: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fields._honey) return;

    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          organization: fields.organization,
          email: fields.email,
          phone: fields.phone,
          message: fields.message,
        }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      // Parse structured error from server
      const data = await res.json().catch(() => null);

      if (data?.fields && typeof data.fields === "object") {
        setFieldErrors(data.fields as Record<string, string>);
      }

      setStatus("error");
      setErrorMsg(
        data?.error ??
          "Something went wrong. Please try again or email us directly at contact@aei-1.com."
      );
    } catch {
      setStatus("error");
      setErrorMsg(
        "Something went wrong. Please try again or email us directly at contact@aei-1.com."
      );
    }
  }

  const isDisabled = status === "submitting";

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-success"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-sans font-semibold text-h3 text-fg">
          Thank you for reaching out.
        </p>
        <p className="font-body text-body text-fg-secondary">
          We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot — hidden from real users, traps bots */}
      <input
        type="text"
        name="_honey"
        value={fields._honey}
        onChange={handleChange}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />

      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-[var(--radius-button)] px-4 py-3 bg-error/10 border border-error/20 text-error text-small font-body"
        >
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block font-body text-fg-secondary mb-2 text-small"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            value={fields.name}
            onChange={handleChange}
            disabled={isDisabled}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={fieldErrors.name ? inputErrorClass : inputClass}
          />
          <FieldError message={fieldErrors.name} />
        </div>
        <div>
          <label
            htmlFor="organization"
            className="block font-body text-fg-secondary mb-2 text-small"
          >
            Organization
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={fields.organization}
            onChange={handleChange}
            disabled={isDisabled}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block font-body text-fg-secondary mb-2 text-small"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={fields.email}
            onChange={handleChange}
            disabled={isDisabled}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={fieldErrors.email ? inputErrorClass : inputClass}
          />
          <FieldError message={fieldErrors.email} />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block font-body text-fg-secondary mb-2 text-small"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={fields.phone}
            onChange={handleChange}
            disabled={isDisabled}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-body text-fg-secondary mb-2 text-small"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          value={fields.message}
          onChange={handleChange}
          disabled={isDisabled}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={`${fieldErrors.message ? inputErrorClass : inputClass} resize-y`}
        />
        <FieldError message={fieldErrors.message} />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          loading={status === "submitting"}
          disabled={isDisabled}
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}
