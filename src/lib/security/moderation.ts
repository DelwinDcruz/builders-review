/** Spam/abuse signals + sanitisation before a review enters the moderation queue. */
const BANNED = ["viagra", "casino", "loan offer", "crypto giveaway", "http://", "https://", "www."];
const PROFANITY = ["fuck", "shit", "bitch", "asshole", "bastard"];

export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .replace(/\s{3,}/g, " ")
    .trim();
}

export interface SpamAssessment { score: number; flags: string[] }

export function assessSpam(f: { title: string; body: string; name: string }): SpamAssessment {
  const flags: string[] = [];
  const text = `${f.title} ${f.body}`.toLowerCase();
  if (BANNED.some((b) => text.includes(b))) flags.push("banned_terms_or_links");
  if (PROFANITY.some((p) => text.includes(p))) flags.push("profanity");
  const letters = f.body.replace(/[^a-z]/gi, "").length;
  const caps = f.body.replace(/[^A-Z]/g, "").length;
  if (letters > 20 && caps / letters > 0.6) flags.push("excessive_caps");
  if (/(.)\1{6,}/.test(f.body)) flags.push("repeated_characters");
  if (f.body.length < 60) flags.push("very_short");
  if ((f.body.match(/https?:\/\//g) ?? []).length > 0) flags.push("contains_links");
  return { score: flags.length, flags };
}
