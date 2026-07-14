"use client";
import { useEffect, useState } from "react";
import { ThumbsUp, Flag, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatNumber } from "@/lib/format";
import { track } from "@/lib/analytics";

const REASONS = [
  { v: "fake", l: "Fake or fabricated experience" },
  { v: "offensive", l: "Offensive or abusive language" },
  { v: "conflict", l: "Conflict of interest / incentivised" },
  { v: "privacy", l: "Contains private information" },
  { v: "spam", l: "Spam or promotional" },
  { v: "other", l: "Something else" }
];

export function HelpfulReport({ slug, initialHelpful }: { slug: string; initialHelpful: number }) {
  const { notify } = useToast();
  const [helpful, setHelpful] = useState(initialHelpful);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("fake");
  const [details, setDetails] = useState("");

  useEffect(() => { try { if (localStorage.getItem(`helpful:${slug}`)) setVoted(true); } catch {} }, [slug]);

  async function vote() {
    if (voted || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/reviews/${slug}/helpful`, { method: "POST" });
      if (!res.ok) throw new Error();
      const d = await res.json().catch(() => ({}));
      setHelpful((h) => (typeof d.helpfulCount === "number" ? d.helpfulCount : h + 1));
      setVoted(true);
      try { localStorage.setItem(`helpful:${slug}`, "1"); } catch {}
      track("helpful_vote_submitted", { slug });
      notify("Thanks — marked as helpful.", "success");
    } catch { notify("Couldn't record your vote. Please try again.", "error"); }
    finally { setBusy(false); }
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      const res = await fetch(`/api/reviews/${slug}/report`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason, details })
      });
      if (!res.ok) throw new Error();
      track("review_reported", { slug, reason });
      setReportOpen(false); setDetails("");
      notify("Report submitted. Our moderators will review it.", "success");
    } catch { notify("Couldn't submit the report. Please try again.", "error"); }
    finally { setBusy(false); }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={vote} disabled={voted || busy} aria-pressed={voted}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border px-4 text-meta-lg font-semibold hover:bg-surface-2 disabled:opacity-60">
        {busy && !reportOpen ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <ThumbsUp size={15} aria-hidden="true" />}
        {voted ? "Marked helpful" : "Helpful"} <span className="tabular-nums text-muted">({formatNumber(helpful)})</span>
      </button>

      <button onClick={() => setReportOpen((v) => !v)} aria-expanded={reportOpen} aria-controls="report-panel"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border px-4 text-meta-lg font-semibold text-muted hover:bg-surface-2">
        <Flag size={15} aria-hidden="true" /> Report
      </button>

      {reportOpen && (
        <form id="report-panel" onSubmit={submitReport} className="card mt-2 w-full max-w-md p-5" role="dialog" aria-label="Report this review">
          <h3 className="mb-3 text-card font-semibold">Report this review</h3>
          <fieldset className="space-y-2">
            <legend className="mb-1 text-meta-lg text-muted">Why are you reporting it?</legend>
            {REASONS.map((r) => (
              <label key={r.v} className="flex items-center gap-2 text-meta-lg">
                <input type="radio" name="reason" value={r.v} checked={reason === r.v} onChange={() => setReason(r.v)} className="accent-[rgb(var(--brand))]" />
                {r.l}
              </label>
            ))}
          </fieldset>
          <label className="mt-3 block text-meta-lg">
            <span className="mb-1 block text-muted">Optional details</span>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={500} rows={3}
              className="w-full rounded-lg border border-border bg-surface p-3 text-body outline-none focus-visible:border-brand" />
          </label>
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={busy} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand px-4 text-meta-lg font-semibold text-brand-fg disabled:opacity-60">
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />} Submit report
            </button>
            <button type="button" onClick={() => setReportOpen(false)} className="min-h-[44px] rounded-lg px-4 text-meta-lg text-muted hover:bg-surface-2">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
