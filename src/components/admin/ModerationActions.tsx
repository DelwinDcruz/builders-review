"use client";
import { useState, useTransition } from "react";
import { Check, X, Loader2, MessageSquareReply } from "lucide-react";
import { setReviewStatus, setCompanyResponse } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

export function ModerationActions({ reviewId, status }: { reviewId: string; status: string }) {
  const { notify } = useToast();
  const [pending, start] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [responding, setResponding] = useState(false);
  const [reason, setReason] = useState("");
  const [response, setResponse] = useState("");

  const run = (fn: () => Promise<{ ok: boolean; message: string }>) => start(async () => {
    try { const r = await fn(); notify(r.message, r.ok ? "success" : "error"); setRejecting(false); setResponding(false); }
    catch { notify("Action failed — check your permissions.", "error"); }
  });

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {status !== "approved" && (
        <button onClick={() => run(() => setReviewStatus(reviewId, "approved"))} disabled={pending}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg bg-success px-3 text-meta-lg font-semibold text-white disabled:opacity-50">
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
        </button>
      )}
      {!rejecting ? (
        <button onClick={() => setRejecting(true)} disabled={pending}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-border px-3 text-meta-lg hover:bg-surface-2">
          <X size={14} /> {status === "approved" ? "Remove" : "Reject"}
        </button>
      ) : (
        <span className="inline-flex items-center gap-2">
          <label className="sr-only">Reason</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (recorded)"
            className="h-10 rounded-lg border border-border bg-surface px-2 text-meta-lg" />
          <button onClick={() => run(() => setReviewStatus(reviewId, status === "approved" ? "removed" : "rejected", reason || "guideline breach"))}
            disabled={pending} className="inline-flex min-h-[40px] items-center rounded-lg bg-error px-3 text-meta-lg font-semibold text-white disabled:opacity-50">Confirm</button>
        </span>
      )}
      {status === "approved" && (
        !responding ? (
          <button onClick={() => setResponding(true)} className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-border px-3 text-meta-lg hover:bg-surface-2">
            <MessageSquareReply size={14} /> Respond
          </button>
        ) : (
          <span className="flex w-full items-center gap-2">
            <label className="sr-only">Company response</label>
            <input value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Public response from Portfolio Builders"
              className="h-10 flex-1 rounded-lg border border-border bg-surface px-2 text-meta-lg" />
            <button onClick={() => run(() => setCompanyResponse(reviewId, response))} disabled={pending || !response.trim()}
              className="inline-flex min-h-[40px] items-center rounded-lg bg-brand px-3 text-meta-lg font-semibold text-brand-fg disabled:opacity-50">Post</button>
          </span>
        )
      )}
      <p className="w-full text-meta text-muted">Rejections record a reason and are audit-logged. A genuine review is never removed for being negative.</p>
    </div>
  );
}
