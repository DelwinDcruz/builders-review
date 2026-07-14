/**
 * Rating normalization. Converts a source's ORIGINAL rating to 0..5 only when
 * that is mathematically AND semantically defensible.
 * Returns null — never a fabricated star value — for recommendation percentages
 * and letter grades, which are surfaced in their original form instead.
 */
import type { RatingType } from "./types";

export function normalizeToFiveStar(value: number, min: number, max: number): number | null {
  if (max <= min) return null;
  const clamped = Math.min(max, Math.max(min, value));
  return Math.round(((clamped - min) / (max - min)) * 5 * 100) / 100;
}

export function normalizedForType(t: RatingType, value: number, min: number, max: number): number | null {
  if (t === "five_star") return normalizeToFiveStar(value, min, max);
  return null; // recommendation_pct, letter_grade -> never stars
}

export const isStarCompatible = (t: RatingType) => t === "five_star";

export function originalRatingLabel(t: RatingType, value: number, letterGrade?: string | null): string {
  switch (t) {
    case "five_star": return `${value.toFixed(1)} / 5`;
    case "recommendation_pct": return `${Math.round(value)}% recommend`;
    case "letter_grade": return letterGrade ?? "Accreditation";
    default: return String(value);
  }
}
