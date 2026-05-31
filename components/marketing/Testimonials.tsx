"use client";

/* ============================================================
   SideQuest — Testimonials banner (student voices).
   Gradient-ring avatars; swap in real photos via /public/people/.
   ============================================================ */

import React from "react";
import { Icon } from "@/components/ui";
import { PersonAvatar } from "@/components/marketing/chrome";

interface Testimonial {
  quote: string;
  name: string;
  meta: string;
  src?: string; // optional headshot in /public/people/
  feature?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "SideQuest helped me kickstart my career. I stacked three placements in one term and finished my co-op hours without quitting my part-time job.",
    name: "Maya Thompson",
    meta: "Business Administration · Fanshawe",
    feature: true,
  },
  {
    quote:
      "I didn't think my café job counted for anything. SideQuest pulled real skills off my résumé and matched me to a marketing role.",
    name: "Jordan Bélanger",
    meta: "Media & Communications · Western",
  },
  {
    quote:
      "The certificate made my résumé legit — I walked into interviews with verified hours instead of just promises.",
    name: "Aanya Gupta",
    meta: "Graphic Design · Fanshawe",
  },
];

function Stars() {
  return (
    <div className="sq-testi-stars" aria-label="5 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={14} style={{ fill: "var(--gold-2)" }} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="container sq-section">
      <div className="how-head">
        <div>
          <span className="sq-kicker eyebrow">
            <Icon name="sparkle" size={14} /> Student voices
          </span>
          <h2 className="display sq-h2">Careers, kickstarted.</h2>
        </div>
        <p className="sq-lede">
          Hundreds of London students have turned scattered gigs into a finished co-op and a verified head start.
        </p>
      </div>
      <div className="sq-testi-strip">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className={`sq-testi${t.feature ? " feature" : ""}`}>
            {!t.feature && <Stars />}
            <span className="sq-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote className="sq-testi-quote">{t.quote}</blockquote>
            <figcaption className="sq-testi-foot">
              <PersonAvatar name={t.name} src={t.src} />
              <div style={{ minWidth: 0 }}>
                <div className="sq-testi-name">{t.name}</div>
                <div className="sq-testi-meta">{t.meta}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
