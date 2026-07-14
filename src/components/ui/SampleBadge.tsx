import { FlaskConical } from "lucide-react";
import { isSampleModeActive } from "@/lib/data/repo";
export function SampleDataBanner() {
  if (!isSampleModeActive()) return null;
  return (
    <div className="border-b border-warning/25 bg-warning/10 text-warning">
      <div className="container-app flex items-center justify-center gap-2 py-2 text-center text-meta font-medium">
        <FlaskConical size={14} aria-hidden="true" />
        <span>Sample data mode — reviews and ratings shown are development examples, not real Portfolio Builders reviews.</span>
      </div>
    </div>
  );
}
export const SampleTag = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-meta font-semibold text-warning">
    <FlaskConical size={11} aria-hidden="true" /> Sample
  </span>
);
