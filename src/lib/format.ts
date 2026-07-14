export const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "";
export const formatNumber = (n: number) => new Intl.NumberFormat("en-IN").format(n);
export const cx = (...p: (string | false | null | undefined)[]) => p.filter(Boolean).join(" ");
export const pluralize = (n: number, w: string) => `${formatNumber(n)} ${w}${n === 1 ? "" : "s"}`;
