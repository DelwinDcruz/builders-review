"use client";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const TOPICS = [
  { v: "dispute", l: "Dispute a review" },
  { v: "technical", l: "Report a technical issue" },
  { v: "general", l: "General enquiry" },
  { v: "privacy", l: "Privacy / data request" }
];

export function ContactForm() {
  const { notify } = useToast();
  const [f, setF] = useState({ topic: "general", name: "", email: "", message: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (f.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) errs.email = "Enter a valid email address.";
    if (f.message.trim().length < 20) errs.message = "Please add at least 20 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      if (res.ok) setDone(true);
      else { const d = await res.json().catch(() => ({})); notify(d.error ?? "Could not send message.", "error"); }
    } catch { notify("Network error. Please try again.", "error"); }
    finally { setBusy(false); }
  }

  if (done) return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success"><CheckCircle2 size={26} /></div>
      <h2 className="text-card font-semibold">Message sent</h2>
      <p className="mt-1 text-body text-muted">Thanks — we aim to respond within 3 business days.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="card space-y-5 p-7" noValidate>
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label>Leave empty<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} /></label>
      </div>
      <label className="block text-meta-lg">
        <span className="mb-1.5 block font-semibold">What is this about?</span>
        <select value={f.topic} onChange={(e) => set("topic", e.target.value)} className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-body">
          {TOPICS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>
      </label>
      <label className="block text-meta-lg">
        <span className="mb-1.5 block font-semibold">Your name</span>
        <input value={f.name} onChange={(e) => set("name", e.target.value)} className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-body" />
        {errors.name && <span role="alert" className="mt-1.5 block font-medium text-error">{errors.name}</span>}
      </label>
      <label className="block text-meta-lg">
        <span className="mb-1.5 block font-semibold">Your email</span>
        <input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-body" />
        {errors.email && <span role="alert" className="mt-1.5 block font-medium text-error">{errors.email}</span>}
      </label>
      <label className="block text-meta-lg">
        <span className="mb-1.5 block font-semibold">Message</span>
        <textarea value={f.message} onChange={(e) => set("message", e.target.value)} rows={6} maxLength={2000} className="w-full rounded-lg border border-border bg-surface p-4 text-body" />
        {errors.message && <span role="alert" className="mt-1.5 block font-medium text-error">{errors.message}</span>}
      </label>
      <button type="submit" disabled={busy} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-brand px-6 font-semibold text-brand-fg disabled:opacity-60">
        {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />} Send message
      </button>
    </form>
  );
}
