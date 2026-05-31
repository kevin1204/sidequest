"use client";

/* ============================================================
   SideQuest — Company logo marks.
   Our businesses are fictional London shops, so there are no real
   third-party logos. Instead each gets a distinctive brand-coloured
   badge with an industry glyph (coffee, beer, waves, …) — reads like
   a real logo set, renders offline. Falls back to initials when a
   company isn't in the map.
   ============================================================ */

import React from "react";
import { CoTile } from "@/components/ui";
import { getCompanyColor } from "@/lib/taxonomies";

/* Lucide-style glyphs (pipe-separated subpaths), drawn white on the brand colour. */
const GLYPHS: Record<string, string> = {
  "Forest City Roasters": "M17 8h1a4 4 0 1 1 0 8h-1|M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z|M6 2v2|M10 2v2|M14 2v2",
  "Thames Valley Marketing Group": "m3 11 18-5v12L3 14v-3z|M11.6 16.8a3 3 0 1 1-5.8-1.6",
  "Northern Currents Studio":
    "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1|M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1|M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1",
  "Riverbend Design Co.":
    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  "Innovation Works": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5|M9 18h6|M10 22h4",
  "Old East Village Grocer":
    "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z|M2 21c0-3 1.85-5.36 5.08-6",
  "Powerhouse Brewing Co.":
    "M17 11h1a3 3 0 0 1 0 6h-1|M9 12v6|M13 12v6|M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5z|M5 8v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V8",
  "Westmount Community Centre":
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75",
  "Forest City Media Co.":
    "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z|M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

export function CompanyLogo({ name, size = 48, radius = 13 }: { name: string; size?: number; radius?: number }) {
  const glyph = GLYPHS[name];
  if (!glyph) return <CoTile name={name} size={size} radius={radius} />;
  const color = getCompanyColor(name);
  const ic = Math.round(size * 0.5);
  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: color,
        display: "grid",
        placeItems: "center",
        flex: "none",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)",
      }}
    >
      <svg width={ic} height={ic} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {glyph.split("|").map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </div>
  );
}
