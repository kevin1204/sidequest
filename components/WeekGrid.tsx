"use client";

/* ============================================================
   SideQuest — Weekly availability grid (optional).
   7 days × hourly slots (8am–8pm). In edit mode, tapping a cell
   cycles unset → available → class → unset. Read-only just renders.
   Scrolls horizontally on narrow screens.
   ============================================================ */

import React from "react";
import { Icon } from "@/components/ui";
import { DAYS, HOURS, totalAvailableHours } from "@/lib/schedule";
import type { AvailabilityGrid, DayKey, StudentSlot } from "@/lib/types";

function cycle(cur: StudentSlot | undefined): StudentSlot | undefined {
  if (cur === undefined) return "available";
  if (cur === "available") return "class";
  return undefined;
}

export function WeekGrid({
  value,
  editable = false,
  onChange,
}: {
  value?: AvailabilityGrid;
  editable?: boolean;
  onChange?: (grid: AvailabilityGrid) => void;
}) {
  const grid = value ?? {};
  const totalHours = totalAvailableHours(grid);

  function toggle(day: DayKey, hour: string) {
    if (!editable || !onChange) return;
    const next = cycle(grid[day]?.[hour]);
    const dayObj: Record<string, StudentSlot> = { ...(grid[day] ?? {}) };
    if (next === undefined) delete dayObj[hour];
    else dayObj[hour] = next;
    const ng: AvailabilityGrid = { ...grid, [day]: dayObj };
    if (Object.keys(dayObj).length === 0) delete ng[day];
    onChange(ng);
  }

  return (
    <div>
      <div className="weekgrid-scroll">
        <div className="weekgrid">
          <div className="weekgrid-corner" />
          {HOURS.map((h) => (
            <div key={h.key} className="weekgrid-colhead">
              {h.label}
            </div>
          ))}
          {DAYS.map((d) => (
            <React.Fragment key={d.key}>
              <div className="weekgrid-rowhead">{d.label}</div>
              {HOURS.map((h) => {
                const slot = grid[d.key]?.[h.key];
                return (
                  <button
                    key={h.key}
                    type="button"
                    disabled={!editable}
                    onClick={() => toggle(d.key, h.key)}
                    title={`${d.label} ${h.label}`}
                    className={`weekgrid-cell ${slot ?? "empty"} ${editable ? "editable" : ""}`}
                    aria-label={`${d.label} ${h.label}: ${slot ?? "not available"}`}
                  >
                    {slot === "available" && <Icon name="check" size={12} />}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="weekgrid-legend">
        <span>
          <span className="dot" style={{ background: "var(--tl-50)", border: "1.5px solid var(--tl-300)" }} /> Available
        </span>
        <span>
          <span className="dot" style={{ background: "var(--bg-2)", border: "1.5px dashed var(--line)" }} /> In class
        </span>
        {editable && <span className="hint">Tap an hour to set it</span>}
        {totalHours > 0 && (
          <span className="weekgrid-total" style={{ marginLeft: "auto" }}>
            <Icon name="clock" size={13} /> {totalHours} hrs/week available
          </span>
        )}
      </div>
    </div>
  );
}
