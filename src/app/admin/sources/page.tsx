import { ExternalLink, KeyRound } from "lucide-react";
import { getSourceOverviews } from "@/lib/data/sources-repo";
import { GROUP_LABELS, SOURCE_LABEL, getSourceDef } from "@/lib/sources/definitions";
import { STATUS_LABELS } from "@/lib/sources/status";
import { SourceMark } from "@/components/sources/SourceMark";
import { SourceActions } from "@/components/admin/SourceActions";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const GOOGLE_KEY_SET = Boolean(process.env.GOOGLE_MAPS_API_KEY);

export default async function AdminSources() {
  const sources = await getSourceOverviews();
  const google = sources.find((s) => s.def.slug === "google");
  console.log("[GOOGLE DEBUG]", {
  apiKeySet: Boolean(process.env.GOOGLE_MAPS_API_KEY),
  sourceFound: Boolean(google),
  profile: google?.profile ?? null,
  status: google?.status ?? null,
  connected: google?.connected ?? false,
});
  const gdef = getSourceDef("google")!;

  return (
    <div>
      <h1 className="mb-2 font-display text-h3 font-extrabold">Review sources</h1>
      <p className="mb-8 text-meta-lg text-muted">
        A source is only <strong>Connected</strong> when a genuine profile is verified <em>and</em> a permitted integration actually works — never because a URL was entered.
      </p>

      {/* Google integration */}
      <section className="card mb-10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <SourceMark slug="google" size={56} />
            <div>
              <h2 className="text-card font-bold">Google integration</h2>
              <p className="text-meta text-muted">Places API · requires a real Place ID and a server-side API key</p>
            </div>
          </div>
          <Badge tone={GOOGLE_KEY_SET ? "success" : "warning"}>
            <KeyRound size={12} aria-hidden="true" /> {GOOGLE_KEY_SET ? "GOOGLE_MAPS_API_KEY set" : "API key missing"}
          </Badge>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-meta-lg">
          {/* <Field label="Integration mode" value={SOURCE_LABEL[google?.profile?.integrationMode ?? gdef.defaultMode]} /> */}
          <Field
  label="Integration mode"
  value={
    SOURCE_LABEL[
      google?.profile?.integrationMode ?? gdef.defaultMode
    ] ?? "Unknown"
  }
/>
          <Field label="Connection status" value={STATUS_LABELS[google?.status ?? "disabled"]} />
          <Field label="External profile ID (Place ID)" value={google?.profile?.externalProfileId ?? "—"} mono />
          <Field label="Last synchronized" value={google?.profile?.lastSyncAt ? formatDate(google.profile.lastSyncAt) : "Never"} />
          <Field label="Real rating" value={google?.profile?.externalOverallRating !== null && google?.profile ? String(google.profile.externalOverallRating) : "—"} />
          <Field label="Real review count" value={google?.profile?.externalReviewCount != null ? formatNumber(google.profile.externalReviewCount) : "—"} />
          <div className="sm:col-span-2">
            <dt className="text-meta font-bold uppercase tracking-wider text-muted">Profile URL</dt>
            <dd className="mt-1">
              {google?.profile?.externalProfileUrl?.startsWith("http")
                ? <a href={google.profile.externalProfileUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">Open <ExternalLink size={12} aria-hidden="true" /></a>
                : <span className="text-muted">—</span>}
            </dd>
          </div>
        </dl>

        <p className="mt-5 rounded-lg border border-info/30 bg-info/10 p-4 text-meta-lg text-info">
          <strong>Limits, enforced in the UI:</strong> {gdef.integration.complianceNotes} Attribution: {gdef.integration.attribution}
        </p>

        <SourceActions sourceSlug="google" profile={google?.profile} />
      </section>

      {/* All sources */}
      {(["learner", "employer"] as const).map((group) => {
        const items = sources.filter((s) => s.def.group === group);
        return (
          <section key={group} className="mb-10">
            <h2 className="mb-1 text-card font-bold">{GROUP_LABELS[group]}</h2>
            <p className="mb-4 text-meta text-muted">
              {group === "employer" ? "Employee reviews. Never merged into learner scores." : "Star-compatible sources feed the combined learner score, weighted by review count."}
            </p>
            <div className="space-y-4">
              {items.map((s) => (
                <div key={s.def.slug} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <SourceMark slug={s.def.slug} size={40} />
                      <div>
                        <p className="font-semibold">{s.def.name}</p>
                        <p className="text-meta text-muted">
                          Mode: {SOURCE_LABEL[s.profile?.integrationMode ?? s.def.defaultMode]} ·
                          Rating: {s.profile?.externalOverallRating ?? "—"} ·
                          Reviews: {s.profile?.externalReviewCount != null ? formatNumber(s.profile.externalReviewCount) : "—"} ·
                          Last sync: {s.profile?.lastSyncAt ? formatDate(s.profile.lastSyncAt) : "never"}
                        </p>
                      </div>
                    </div>
                    <Badge tone={s.connected ? "success" : s.status === "disabled" ? "neutral" : "warning"}>{STATUS_LABELS[s.status]}</Badge>
                  </div>
                  <SourceActions sourceSlug={s.def.slug} profile={s.profile} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-meta font-bold uppercase tracking-wider text-muted">{label}</dt>
      <dd className={`mt-1 ${mono ? "font-mono text-meta" : ""}`}>{value}</dd>
    </div>
  );
}
