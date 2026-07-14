import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "builders.review — real Portfolio Builders reviews from students, interns and trusted platforms";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card. System fonts only, so it always renders. */
export default async function OgImage() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: 80, background: "#112D4E", color: "white", fontFamily: "sans-serif"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, opacity: .9 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.16)", fontWeight: 800 }}>BR</div>
          builders.review
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginTop: 40, letterSpacing: -2 }}>
          Real Portfolio Builders reviews — from students, interns and trusted platforms.
        </div>
        <div style={{ display: "flex", fontSize: 26, marginTop: 32, color: "#D97706" }}>
          Courses · Internships · Mentors · Career support · Community
        </div>
      </div>
    ), { ...size }
  );
}
