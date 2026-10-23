import { ImageResponse } from "next/og";
import { createElement } from "react";
import { COVER_THEMES, getArticle } from "@/const/journal";
import { COVER_ICON_NODES } from "@/const/journal/coverIcons";

export const COVER_SIZE = { width: 1200, height: 630 };

/**
 * Draws a Journal cover. "cover" is the artwork used on cards and at the
 * top of the article; "share" adds the title for WhatsApp, Google and
 * social previews.
 */
export function renderCover(slug: string, variant: "cover" | "share") {
  const a = getArticle(slug);
  if (!a) return new Response("Not found", { status: 404 });

  const t = COVER_THEMES[a.cover.theme];
  const icon = COVER_ICON_NODES[a.cover.icon];
  const headline = variant === "share" ? a.title : a.cover.kicker;
  const headlineSize = variant === "share" ? (a.title.length > 60 ? 52 : 60) : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundImage: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Soft shapes */}
        <div
          style={{
            position: "absolute",
            right: -170,
            top: -190,
            width: 720,
            height: 720,
            borderRadius: 9999,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 70,
            width: 490,
            height: 490,
            borderRadius: 9999,
            border: "2px solid rgba(255,255,255,0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -140,
            bottom: -220,
            width: 520,
            height: 520,
            borderRadius: 9999,
            backgroundColor: t.accent,
            opacity: 0.16,
          }}
        />
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: 640 + c * 22,
                top: 470 + r * 22,
                width: 5,
                height: 5,
                borderRadius: 9999,
                backgroundColor: "rgba(255,255,255,0.35)",
              }}
            />
          )),
        )}

        {/* Icon */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 150,
            width: 330,
            height: 330,
            borderRadius: 9999,
            backgroundColor: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="210"
            height="210"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
          </svg>
        </div>

        {/* Text */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 64,
            bottom: 64,
            width: variant === "share" ? 700 : 620,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                backgroundColor: t.accent,
              }}
            />
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 5 }}>
              POTENT JOURNAL
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "10px 20px",
                borderRadius: 9999,
                backgroundColor: "rgba(255,255,255,0.16)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              {(variant === "share" ? a.cover.kicker : a.category).toUpperCase()}
            </div>
            <div
              style={{
                fontSize: headlineSize,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1,
              }}
            >
              {headline}
            </div>
            <div style={{ fontSize: 24, opacity: 0.85 }}>potenthygiene.com</div>
          </div>
        </div>
      </div>
    ),
    {
      ...COVER_SIZE,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    },
  );
}
