"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, ShieldCheck, BookOpen, Briefcase, Route, Users, LayoutGrid, Compass, MessagesSquare, Monitor, Star } from "lucide-react";
import { StarInput } from "./StarInput";
import { LIMITS } from "@/lib/validation/review";
import { EXPERIENCE_META, type ExpKey } from "@/lib/sources/branding";
import { useToast } from "@/components/ui/Toast";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/format";

const ICONS = { book: BookOpen, briefcase: Briefcase, route: Route, users: Users, layout: LayoutGrid, compass: Compass, messages: MessagesSquare, monitor: Monitor, star: Star };
const EXPERIENCES: ExpKey[] = ["course","internship","program","mentorship","portfolio_service","career_support","community","website","other"];
const NEEDS_PROGRAM = ["course","internship","program","portfolio_service"];
const RELATIONSHIPS = [
  { v: "student", l: "Student" }, { v: "intern", l: "Intern" }, { v: "alumni", l: "Alumni" },
  { v: "career_switcher", l: "Career switcher" }, { v: "parent", l: "Parent / guardian" },
  { v: "mentor", l: "Mentor" }, { v: "other", l: "Other" }
];
const STEPS = ["Experience", "Program", "Ratings", "Your review", "About you", "Preview"];
const DRAFT_KEY = "builders-review-draft-v1";

interface Props {
  programs: { slug: string; title: string; type: string }[];
  categories: { key: string; label: string }[];
  initial: { experience?: string; program?: string };
}

export function WriteReviewForm({ programs, categories, initial }: Props) {
  const { notify } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftSaved, setDraftSaved] = useState(false);

  const [experience, setExperience] = useState<ExpKey>((initial.experience as ExpKey) || "course");
  const [program, setProgram] = useState(initial.program ?? "");
  const [overall, setOverall] = useState(0);
  const [cats, setCats] = useState<Record<string, number>>({});
  const [title, setTitle] = useState(""); const [body, setBody] = useState("");
  const [pros, setPros] = useState<string[]>([""]); const [imps, setImps] = useState<string[]>([""]);
  const [outcome, setOutcome] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("student");
  const [batch, setBatch] = useState(""); const [expDate, setExpDate] = useState("");
  const [consent, setConsent] = useState(false); const [guidelines, setGuidelines] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => { track("review_form_started", {}); }, []);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.title) setTitle(d.title); if (d.body) setBody(d.body);
      if (typeof d.overall === "number") setOverall(d.overall);
      if (d.name) setName(d.name); if (d.email) setEmail(d.email);
    } catch {}
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, body, overall, name, email }));
        if (title || body || overall) { setDraftSaved(true); setTimeout(() => setDraftSaved(false), 2000); }
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [title, body, overall, name, email]);

  const options = useMemo(() => programs.filter((p) => p.type === experience), [programs, experience]);
  const needsProgram = NEEDS_PROGRAM.includes(experience);

  function validate(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 2 && needsProgram && !program) e.program = "Select the exact program, course or internship.";
    if (s === 3 && !overall) e.overall = "An overall star rating is required.";
    if (s === 4) {
      if (title.trim().length < LIMITS.title.min) e.title = `Title needs at least ${LIMITS.title.min} characters.`;
      if (body.trim().length < LIMITS.body.min) e.body = `Review needs at least ${LIMITS.body.min} characters.`;
    }
    if (s === 5) {
      if (name.trim().length < LIMITS.name.min) e.name = "Please enter your display name.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Please enter a valid email address.";
      if (!expDate) e.expDate = "Please add your date of experience.";
      else if (new Date(expDate) > new Date()) e.expDate = "The date can't be in the future.";
    }
    if (s === 6) {
      if (!consent) e.consent = "You must accept the privacy notice.";
      if (!guidelines) e.guidelines = "You must accept the review guidelines.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validate(step)) setStep((s) => Math.min(6, s + 1)); }
  function back() { setErrors({}); setStep((s) => Math.max(1, s - 1)); }

  async function submit() {
    if (!validate(6)) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceType: experience, programSlug: needsProgram ? program : (program || null),
          overallRating: overall,
          categoryRatings: Object.entries(cats).filter(([, v]) => v > 0).map(([categoryKey, value]) => ({ categoryKey, value })),
          title: title.trim(), body: body.trim(),
          pros: pros.map((p) => p.trim()).filter(Boolean), improvements: imps.map((p) => p.trim()).filter(Boolean),
          outcome: outcome.trim(), wouldRecommend: recommend,
          reviewerName: name.trim(), reviewerEmail: email.trim(), relationship, batch: batch.trim(),
          experienceDate: expDate, consentPrivacy: consent, acceptGuidelines: guidelines, website: honeypot
        })
      });
      if (res.status === 201) {
        track("review_submitted", { experience });
        try { localStorage.removeItem(DRAFT_KEY); } catch {}
        setDone(true);
      } else {
        const d = await res.json().catch(() => ({}));
        notify(d.error ?? "Submission failed. Please check your entries.", "error");
      }
    } catch { notify("Network error. Please try again.", "error"); }
    finally { setSubmitting(false); }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success"><CheckCircle2 size={32} /></div>
        {/* <h1 className="font-display text-h3 font-extrabold tracking-tight">Thank you — your review was submitted</h1> */}
        <h1 className="font-display text-h3 font-extrabold tracking-tight">
  Thank you — your comment is now published
</h1>
        <div className="card mt-6 p-7 text-left text-body text-muted">
          <p className="flex items-start gap-2">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            {/* <span><strong className="text-fg">What happens next:</strong> we've emailed you a verification link. Once you confirm it, a moderator checks your review against the guidelines before it is published. Reviews are never published automatically, and genuine criticism is never removed for being negative.</span> */}
            <span>
  <strong className="text-fg">Published successfully:</strong> your comment
  has been saved and is now visible on the reviews page.
</span>
          </p>
          <p className="mt-3">Read our <Link href="/moderation-policy" className="font-semibold text-brand hover:underline">moderation policy</Link> and <Link href="/review-guidelines" className="font-semibold text-brand hover:underline">review guidelines</Link>.</p>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/reviews" className="inline-flex min-h-[48px] items-center rounded-lg border border-border px-5 font-semibold">Browse reviews</Link>
          <Link href="/" className="inline-flex min-h-[48px] items-center rounded-lg bg-brand px-5 font-semibold text-brand-fg">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-10 flex items-center gap-2 overflow-x-auto pb-1" aria-label="Progress">
        {STEPS.map((label, i) => {
          const n = i + 1; const state = n < step ? "done" : n === step ? "current" : "todo";
          return (
            <li key={label} className="flex shrink-0 items-center gap-2">
              <span aria-current={state === "current" ? "step" : undefined}
                className={cx("flex h-9 w-9 items-center justify-center rounded-full text-meta-lg font-bold",
                  state === "done" && "bg-success text-white",
                  state === "current" && "bg-brand text-brand-fg ring-4 ring-brand/15",
                  state === "todo" && "bg-surface-2 text-muted")}>{state === "done" ? "✓" : n}</span>
              <span className={cx("hidden text-meta-lg sm:inline", state === "current" ? "font-bold text-fg" : "text-muted")}>{label}</span>
              {n < STEPS.length && <span aria-hidden="true" className={cx("h-0.5 w-6 rounded-full", n < step ? "bg-success" : "bg-border")} />}
            </li>
          );
        })}
      </ol>

      {draftSaved && (
        <p role="status" className="mb-4 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-meta font-medium text-muted">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" /> Draft saved
        </p>
      )}

      <div className="card p-7 sm:p-9">
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
        </div>

        {step === 1 && (
          <Fieldset legend="What did you experience?">
            <div className="grid gap-3 sm:grid-cols-3">
              {EXPERIENCES.map((e) => {
                const meta = EXPERIENCE_META[e]; const Icon = ICONS[meta.icon]; const on = experience === e;
                const style = { ["--ea" as string]: meta.accent } as CSSProperties;
                return (
                  <label key={e} style={style}
                    className={cx("cursor-pointer rounded-xl border-2 p-4 transition", on ? "border-[rgb(var(--ea))] bg-[rgb(var(--ea)/0.06)] shadow-md" : "border-border hover:border-border-strong")}>
                    <input type="radio" name="experience" value={e} checked={on} onChange={() => { setExperience(e); setProgram(""); }} className="sr-only" />
                    <span aria-hidden="true" className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `rgb(${meta.accent} / 0.12)`, color: `rgb(${meta.accent})` }}><Icon size={18} /></span>
                    <span className="block text-meta-lg font-bold leading-tight">{meta.label.replace(" review", "")}</span>
                  </label>
                );
              })}
            </div>
          </Fieldset>
        )}

        {step === 2 && (
          <Fieldset legend={needsProgram ? "Which exact program?" : "Anything more specific? (optional)"}>
            {options.length > 0 ? (
              <div className="space-y-2">
                {options.map((p) => (
                  <label key={p.slug} className={cx("flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-body", program === p.slug ? "border-brand bg-brand/5" : "border-border hover:bg-surface-2")}>
                    <input type="radio" name="program" value={p.slug} checked={program === p.slug} onChange={() => setProgram(p.slug)} className="accent-[rgb(var(--brand))]" />
                    <span className="font-medium">{p.title}</span>
                  </label>
                ))}
              </div>
            ) : <p className="text-body text-muted">No specific program applies to this experience — continue to the next step.</p>}
            {errors.program && <ErrorText id="program">{errors.program}</ErrorText>}
          </Fieldset>
        )}

        {step === 3 && (
          <Fieldset legend="Rate your experience">
            <StarInput id="overall" label="Overall rating" required value={overall} onChange={setOverall} />
            {errors.overall && <ErrorText id="overall">{errors.overall}</ErrorText>}
            <p className="mb-2 mt-6 text-meta-lg font-semibold">Optional category ratings</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {categories.map((c) => (
                <StarInput key={c.key} id={`cat-${c.key}`} label={c.label} value={cats[c.key] ?? 0}
                  onChange={(v) => setCats((p) => ({ ...p, [c.key]: v }))} />
              ))}
            </div>
          </Fieldset>
        )}

        {step === 4 && (
          <Fieldset legend="Write your review">
            <Labelled label="Review title" error={errors.title}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={LIMITS.title.max}
                placeholder="Summarise your experience" className="input" />
              <Counter value={title.length} max={LIMITS.title.max} min={LIMITS.title.min} />
            </Labelled>
            <Labelled label="Your review" error={errors.body}>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={LIMITS.body.max} rows={7}
                placeholder="What was good, what could be better, and why? Be specific and honest." className="textarea" />
              <Counter value={body.length} max={LIMITS.body.max} min={LIMITS.body.min} />
            </Labelled>
            <ListInput label="Positive points (optional)" values={pros} setValues={setPros} max={LIMITS.point.max} tone="success" />
            <ListInput label="Areas for improvement (optional)" values={imps} setValues={setImps} max={LIMITS.point.max} tone="warning" />
            <Labelled label="Outcome or result (optional)" help="e.g. what happened after the course or internship">
              <input value={outcome} onChange={(e) => setOutcome(e.target.value)} maxLength={LIMITS.outcome.max} className="input" />
            </Labelled>
            <fieldset className="mt-2">
              <legend className="mb-2 text-meta-lg font-semibold">Would you recommend Portfolio Builders?</legend>
              <div className="flex flex-wrap gap-2">
                {[{ v: true, l: "Yes" }, { v: false, l: "No" }, { v: null, l: "Prefer not to say" }].map((o) => (
                  <button key={String(o.v)} type="button" onClick={() => setRecommend(o.v)} aria-pressed={recommend === o.v}
                    className={cx("min-h-[44px] rounded-lg border px-4 text-meta-lg font-semibold", recommend === o.v ? "border-brand bg-brand text-brand-fg" : "border-border hover:bg-surface-2")}>{o.l}</button>
                ))}
              </div>
            </fieldset>
          </Fieldset>
        )}

        {step === 5 && (
          <Fieldset legend="About you">
            <Labelled label="Display name" error={errors.name}><input value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name.max} placeholder="Shown publicly with your review" className="input" /></Labelled>
            <Labelled label="Email address" error={errors.email} help="Used only to verify your review. Never shown publicly, never shared.">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="input" />
            </Labelled>
            <Labelled label="Your relationship to Portfolio Builders">
              <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="input">
                {RELATIONSHIPS.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}
              </select>
            </Labelled>
            <Labelled label="Batch or period (optional)" help="e.g. 2026 Cohort 1, or Jan–Apr 2026">
              <input value={batch} onChange={(e) => setBatch(e.target.value)} maxLength={60} className="input" />
            </Labelled>
            <Labelled label="Date of experience" error={errors.expDate}>
              <input type="date" value={expDate} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setExpDate(e.target.value)} className="input" />
            </Labelled>
          </Fieldset>
        )}

        {step === 6 && (
          <Fieldset legend="Preview and submit">
            <div className="rounded-xl border border-border p-5 text-body">
              <Row label="Experience" value={EXPERIENCE_META[experience].label} />
              <Row label="Program" value={programs.find((p) => p.slug === program)?.title ?? "—"} />
              <Row label="Overall" value={`${overall} / 5`} />
              <Row label="Title" value={title} />
              <Row label="Would recommend" value={recommend === null ? "Prefer not to say" : recommend ? "Yes" : "No"} />
              <Row label="By" value={`${name} (${relationship.replace("_", " ")})`} />
            </div>
            <label className="mt-5 flex items-start gap-2 text-meta-lg">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[rgb(var(--brand))]" />
              <span>I have read the <Link href="/privacy-policy" className="font-semibold text-brand underline">Privacy Policy</Link> and consent to my review and display name being published. My email is used only for verification and is never shown publicly.</span>
            </label>
            {errors.consent && <ErrorText id="consent">{errors.consent}</ErrorText>}
            <label className="mt-3 flex items-start gap-2 text-meta-lg">
              <input type="checkbox" checked={guidelines} onChange={(e) => setGuidelines(e.target.checked)} className="mt-1 accent-[rgb(var(--brand))]" />
              <span>This is my genuine, first-hand experience and I accept the <Link href="/review-guidelines" className="font-semibold text-brand underline">Review Guidelines</Link>. I was not offered any reward for a positive review.</span>
            </label>
            {errors.guidelines && <ErrorText id="guidelines">{errors.guidelines}</ErrorText>}
            <p className="mt-6 rounded-lg border border-border bg-surface-2 p-4 text-meta-lg text-muted">
              Your review will not appear immediately. After you verify your email, a moderator checks it against the guidelines before publication.
            </p>
          </Fieldset>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button type="button" onClick={back} disabled={step === 1}
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-4 text-meta-lg font-semibold text-muted hover:bg-surface-2 disabled:opacity-40">
            <ChevronLeft size={16} aria-hidden="true" /> Back
          </button>
          {step < 6 ? (
            <button type="button" onClick={next} className="inline-flex min-h-[44px] items-center gap-1 rounded-lg bg-brand px-5 text-meta-lg font-semibold text-brand-fg">
              Continue <ChevronRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-5 text-meta-lg font-semibold text-accent-fg disabled:opacity-60">
              {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />} Submit review
            </button>
          )}
        </div>
      </div>

      <style>{`.input{height:3rem;width:100%;border-radius:.5rem;border:1px solid rgb(var(--border));background:rgb(var(--surface));padding:0 1rem;font-size:1rem;outline:none}
.input:focus-visible{border-color:rgb(var(--brand))}
.textarea{width:100%;border-radius:.5rem;border:1px solid rgb(var(--border));background:rgb(var(--surface));padding:1rem;font-size:1rem;outline:none}
.textarea:focus-visible{border-color:rgb(var(--brand))}`}</style>
    </div>
  );
}

const Fieldset = ({ legend, children }: { legend: string; children: React.ReactNode }) => (
  <fieldset><legend className="mb-6 font-display text-h3 font-bold tracking-tight">{legend}</legend>{children}</fieldset>
);
const Labelled = ({ label, help, error, children }: { label: string; help?: string; error?: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <label className="mb-1.5 block text-meta-lg font-semibold">{label}</label>
    {help && <p className="mb-2 text-meta-lg text-muted">{help}</p>}
    {children}
    {error && <ErrorText id={label}>{error}</ErrorText>}
  </div>
);
const Counter = ({ value, max, min }: { value: number; max: number; min?: number }) => {
  const under = min !== undefined && value < min;
  return <p className={cx("mt-1.5 text-right text-meta", under ? "text-warning" : "text-muted")}>{value}/{max}{under ? ` · min ${min}` : ""}</p>;
};
const ErrorText = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <p id={`${id}-error`} role="alert" className="mt-1.5 text-meta-lg font-medium text-error">{children}</p>
);
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
    <span className="text-muted">{label}</span><span className="text-right font-medium">{value}</span>
  </div>
);
function ListInput({ label, values, setValues, max, tone }: { label: string; values: string[]; setValues: (v: string[]) => void; max: number; tone: "success" | "warning" }) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-meta-lg font-semibold">{label}</label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <span aria-hidden="true" className={cx("mt-3", tone === "success" ? "text-success" : "text-warning")}>{tone === "success" ? "+" : "△"}</span>
            <input value={v} maxLength={max} onChange={(e) => { const n = [...values]; n[i] = e.target.value; setValues(n); }}
              placeholder={`Add a point (max ${max} chars)`} className="input flex-1" />
            {values.length > 1 && <button type="button" onClick={() => setValues(values.filter((_, x) => x !== i))} className="px-2 text-muted hover:text-error" aria-label="Remove">×</button>}
          </div>
        ))}
      </div>
      {values.length < 5 && <button type="button" onClick={() => setValues([...values, ""])} className="mt-2 text-meta-lg font-semibold text-brand hover:underline">+ Add another</button>}
    </div>
  );
}
