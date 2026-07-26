'use client';

import { useEffect, useRef, useState } from 'react';
import { AuroraButton } from '@/components/ui/AuroraButton';

type Labels = {
  name: string;
  email: string;
  company: string;
  message: string;
  messageHint: string;
  optional: string;
  submit: string;
  errors: { name: string; email: string; message: string };
  notWired: { title: string; body: string };
};

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

/**
 * There is no submission backend yet. Rather than fake a success toast — which
 * would silently lose real enquiries — the form validates properly and then
 * tells the visitor the truth, pointing them at the mail link.
 */
export function ContactForm({
  labels,
  email,
  defaultMessage,
}: {
  labels: Labels;
  email: string;
  /** Pre-filled message, e.g. when arriving from a service page's CTA. */
  defaultMessage?: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [blocked, setBlocked] = useState(false);
  const notice = useRef<HTMLDivElement>(null);

  // After render, not before: rAF fires while the notice is still unmounted.
  useEffect(() => {
    if (blocked) notice.current?.focus();
  }, [blocked]);

  const validate = (form: HTMLFormElement): Errors => {
    const data = new FormData(form);
    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const mail = String(data.get('email') ?? '').trim();
    const msg = String(data.get('message') ?? '').trim();

    if (name.length < 2) next.name = labels.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) next.email = labels.errors.email;
    if (msg.length < 10) next.message = labels.errors.message;
    return next;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(e.currentTarget);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Focus the first invalid field — WCAG error recovery.
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setBlocked(true);
  };

  const field =
    'w-full border-b border-void/20 bg-transparent py-3 text-lg text-void outline-none transition-colors placeholder:text-void/25 focus:border-teal';

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-mono text-label text-teal">
            {labels.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`${field} mt-2`}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-2 text-sm text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="font-mono text-label text-teal">
            {labels.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`${field} mt-2`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-2 text-sm text-red-400">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="company" className="font-mono text-label text-teal">
          {labels.company}{' '}
          <span className="text-teal/50">({labels.optional})</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className={`${field} mt-2`}
        />
      </div>

      <div className="mt-8">
        <label htmlFor="message" className="font-mono text-label text-teal">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={defaultMessage}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? 'message-error message-hint' : 'message-hint'
          }
          className={`${field} mt-2 resize-y`}
        />
        <p id="message-hint" className="mt-2 text-sm text-void/45">
          {labels.messageHint}
        </p>
        {errors.message && (
          <p id="message-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <div className="mt-10">
        <AuroraButton type="submit">{labels.submit}</AuroraButton>
      </div>

      {blocked && (
        <div
          ref={notice}
          tabIndex={-1}
          role="alert"
          className="mt-8 border border-petrol/60 bg-abyss/40 p-6 outline-none"
        >
          <p className="font-medium text-light">{labels.notWired.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-light/60">
            {labels.notWired.body}
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-4 inline-block font-mono text-label text-neon underline underline-offset-4"
          >
            {email}
          </a>
        </div>
      )}
    </form>
  );
}
