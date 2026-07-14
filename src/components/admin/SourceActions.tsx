// "use client";
// import { useState, useTransition } from "react";
// import { PlugZap, RefreshCw, Loader2, Power } from "lucide-react";
// import { testConnection, triggerSync, setSourceEnabled } from "@/app/admin/actions";
// import type { ExternalProfile } from "@/lib/sources/types";
// import { useToast } from "@/components/ui/Toast";

// export function SourceActions({ sourceSlug, profile }: { sourceSlug: string; profile?: ExternalProfile }) {
//   const { notify } = useToast();
//   const [pending, start] = useTransition();
//   const [health, setHealth] = useState<string | null>(null);

//   const run = (fn: () => Promise<{ ok: boolean; message: string }>, capture = false) => start(async () => {
//     try { const r = await fn(); if (capture) setHealth(r.message); notify(r.message, r.ok ? "success" : "error"); }
//     catch { notify("Action failed — check your permissions.", "error"); }
//   });

//   return (
//     <div className="mt-4 flex flex-wrap items-center gap-2">
//       <button disabled={pending || !profile} onClick={() => profile && run(() => testConnection(profile), true)}
//         className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-border px-3 text-meta-lg hover:bg-surface-2 disabled:opacity-50">
//         {pending ? <Loader2 size={14} className="animate-spin" /> : <PlugZap size={14} />} Test connection
//       </button>
//       <button disabled={pending || !profile} onClick={() => profile && run(() => triggerSync(profile))}
//         className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-border px-3 text-meta-lg hover:bg-surface-2 disabled:opacity-50">
//         <RefreshCw size={14} /> Sync now
//       </button>
//       <button disabled={pending} onClick={() => run(() => setSourceEnabled(sourceSlug, false))}
//         className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-error/40 px-3 text-meta-lg text-error hover:bg-error/10 disabled:opacity-50">
//         <Power size={14} /> Disable source
//       </button>
//       {!profile && <p className="w-full text-meta text-warning">No verified profile — add and verify one before testing or syncing.</p>}
//       {health && <p className="w-full text-meta text-muted">{health}</p>}
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  PlugZap,
  Power,
  RefreshCw,
  Save,
} from "lucide-react";

import {
  saveSourceProfile,
  setSourceEnabled,
  testConnection,
  triggerSync,
} from "@/app/admin/actions";

import type { ExternalProfile } from "@/lib/sources/types";
import { useToast } from "@/components/ui/Toast";

type SourceActionsProps = {
  sourceSlug: string;
  profile?: ExternalProfile;
  enabled: boolean;
};

export function SourceActions({
  sourceSlug,
  profile,
  enabled,
}: SourceActionsProps) {
  const router = useRouter();
  const { notify } = useToast();

  const [pending, startTransition] = useTransition();
  const [health, setHealth] = useState<string | null>(null);

  const [externalProfileId, setExternalProfileId] = useState(
    profile?.externalProfileId ?? "",
  );

  const [externalProfileUrl, setExternalProfileUrl] = useState(
    profile?.externalProfileUrl ?? "",
  );

  const isGoogle = sourceSlug === "google";

  useEffect(() => {
    setExternalProfileId(profile?.externalProfileId ?? "");
    setExternalProfileUrl(profile?.externalProfileUrl ?? "");
  }, [profile?.externalProfileId, profile?.externalProfileUrl]);

  const run = (
    action: () => Promise<{ ok: boolean; message: string }>,
    options?: {
      captureHealth?: boolean;
      refresh?: boolean;
    },
  ) => {
    startTransition(async () => {
      try {
        const result = await action();

        if (options?.captureHealth) {
          setHealth(result.message);
        }

        notify(result.message, result.ok ? "success" : "error");

        if (result.ok && options?.refresh !== false) {
          router.refresh();
        }
      } catch (error) {
        console.error("[SourceActions]", error);

        notify(
          "Action failed. Check your permissions and server terminal.",
          "error",
        );
      }
    });
  };

  const handleSaveProfile = () => {
    const cleanProfileId = externalProfileId.trim();
    const cleanProfileUrl = externalProfileUrl.trim();

    if (!cleanProfileId) {
      notify("Enter the real Google Place ID.", "error");
      return;
    }

    if (!cleanProfileUrl) {
      notify("Enter the Google Maps profile URL.", "error");
      return;
    }

    try {
      new URL(cleanProfileUrl);
    } catch {
      notify("Enter a valid Google Maps URL.", "error");
      return;
    }

    run(
      () =>
        saveSourceProfile({
          sourceSlug,
          externalProfileId: cleanProfileId,
          externalProfileUrl: cleanProfileUrl,
          integrationMode: isGoogle
            ? "official_api"
            : profile?.integrationMode ?? "external_link_only",
        }),
      { refresh: true },
    );
  };

  return (
    <div className="mt-5 space-y-4">
      {/* Google profile configuration */}
      {isGoogle && (
        <div className="grid gap-4 rounded-xl border border-border bg-surface-2/40 p-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="google-place-id"
              className="mb-1.5 block text-meta font-bold"
            >
              Google Place ID
            </label>

            <input
              id="google-place-id"
              type="text"
              value={externalProfileId}
              onChange={(event) =>
                setExternalProfileId(event.target.value)
              }
              placeholder="ChIJB8IHkeMNCDsRMC3hTUh1nFY"
              autoComplete="off"
              spellCheck={false}
              className="min-h-11 w-full rounded-lg border border-border bg-background px-3 font-mono text-meta-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label
              htmlFor="google-profile-url"
              className="mb-1.5 block text-meta font-bold"
            >
              Google Maps profile URL
            </label>

            <input
              id="google-profile-url"
              type="url"
              value={externalProfileUrl}
              onChange={(event) =>
                setExternalProfileUrl(event.target.value)
              }
              placeholder="https://www.google.com/maps/place/..."
              autoComplete="url"
              spellCheck={false}
              className="min-h-11 w-full rounded-lg border border-border bg-background px-3 text-meta-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              disabled={pending}
              onClick={handleSaveProfile}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 font-semibold text-brand-fg hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Save size={16} aria-hidden="true" />
              )}

              {profile ? "Update Google profile" : "Save Google profile"}
            </button>
          </div>
        </div>
      )}

      {/* Source actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending || !profile}
          onClick={() =>
            profile &&
            run(() => testConnection(profile), {
              captureHealth: true,
              refresh: true,
            })
          }
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-meta-lg hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <Loader2
              size={14}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            <PlugZap size={14} aria-hidden="true" />
          )}

          Test connection
        </button>

        <button
          type="button"
          disabled={
            pending ||
            !profile ||
            profile.integrationMode !== "official_api"
          }
          onClick={() =>
            profile &&
            run(() => triggerSync(profile), {
              refresh: true,
            })
          }
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-meta-lg hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={pending ? "animate-spin" : ""}
            aria-hidden="true"
          />

          Sync now
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(() => setSourceEnabled(sourceSlug, !enabled), {
              refresh: true,
            })
          }
          className={
            enabled
              ? "inline-flex min-h-11 items-center gap-2 rounded-lg border border-error/40 px-3 text-meta-lg text-error hover:bg-error/10 disabled:opacity-50"
              : "inline-flex min-h-11 items-center gap-2 rounded-lg border border-success/40 px-3 text-meta-lg text-success hover:bg-success/10 disabled:opacity-50"
          }
        >
          <Power size={14} aria-hidden="true" />

          {enabled ? "Disable source" : "Enable source"}
        </button>
      </div>

      {!profile && (
        <p className="text-meta text-warning">
          No profile has been saved. Add the Place ID and Google Maps URL
          before testing or syncing.
        </p>
      )}

      {health && (
        <p
          className="rounded-lg border border-border bg-surface-2 p-3 text-meta text-muted"
          aria-live="polite"
        >
          {health}
        </p>
      )}
    </div>
  );
}