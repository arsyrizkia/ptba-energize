// Timeline utility engine for scrollable multi-year Gantt with zoom levels

export type ZoomLevel = "year" | "quarter" | "month" | "week" | "day";

export interface TimeColumn {
  key: string;
  label: string;
  groupLabel: string;
  start: Date;
  end: Date;
}

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface BarSegment {
  columnIndex: number;
  isStart: boolean;
  isEnd: boolean;
  startFraction: number;
  endFraction: number;
}

export interface HeaderGroup {
  label: string;
  span: number;
}

// ─── Date helpers ───────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfQuarter(d: Date): Date {
  const q = Math.floor(d.getMonth() / 3) * 3;
  return new Date(d.getFullYear(), q, 1);
}

function endOfQuarter(d: Date): Date {
  const q = Math.floor(d.getMonth() / 3) * 3 + 2;
  return new Date(d.getFullYear(), q + 1, 0, 23, 59, 59, 999);
}

function startOfYear(d: Date): Date {
  return new Date(d.getFullYear(), 0, 1);
}

function endOfYear(d: Date): Date {
  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function startOfWeek(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday as start of week
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
}

function endOfWeek(d: Date): Date {
  const s = startOfWeek(d);
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6, 23, 59, 59, 999);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const QUARTER_LABELS = ["Q1", "Q2", "Q3", "Q4"];

function getWeekNumber(d: Date): number {
  const temp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const yearStart = new Date(temp.getFullYear(), 0, 4);
  return 1 + Math.round(((temp.getTime() - yearStart.getTime()) / 86400000 - 3 + ((yearStart.getDay() + 6) % 7)) / 7);
}

// ─── Column generation ──────────────────────────────────────────────────

export function generateColumns(zoom: ZoomLevel, window: TimeWindow): TimeColumn[] {
  const columns: TimeColumn[] = [];

  switch (zoom) {
    case "year": {
      let y = window.start.getFullYear();
      const endY = window.end.getFullYear();
      while (y <= endY) {
        columns.push({
          key: `y-${y}`,
          label: String(y),
          groupLabel: "",
          start: new Date(y, 0, 1),
          end: new Date(y, 11, 31, 23, 59, 59, 999),
        });
        y++;
      }
      break;
    }
    case "quarter": {
      let cur = startOfQuarter(window.start);
      while (cur <= window.end) {
        const qi = Math.floor(cur.getMonth() / 3);
        columns.push({
          key: `q-${cur.getFullYear()}-${qi}`,
          label: QUARTER_LABELS[qi],
          groupLabel: String(cur.getFullYear()),
          start: new Date(cur),
          end: endOfQuarter(cur),
        });
        cur = new Date(cur.getFullYear(), cur.getMonth() + 3, 1);
      }
      break;
    }
    case "month": {
      let cur = startOfMonth(window.start);
      while (cur <= window.end) {
        columns.push({
          key: `m-${cur.getFullYear()}-${cur.getMonth()}`,
          label: SHORT_MONTHS[cur.getMonth()],
          groupLabel: String(cur.getFullYear()),
          start: new Date(cur),
          end: endOfMonth(cur),
        });
        cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      }
      break;
    }
    case "week": {
      let cur = startOfWeek(window.start);
      while (cur <= window.end) {
        const wn = getWeekNumber(cur);
        const mon = cur.getMonth();
        columns.push({
          key: `w-${cur.getFullYear()}-${wn}-${cur.getMonth()}-${cur.getDate()}`,
          label: `W${wn}`,
          groupLabel: `${SHORT_MONTHS[mon]} ${cur.getFullYear()}`,
          start: new Date(cur),
          end: endOfWeek(cur),
        });
        cur = addDays(cur, 7);
      }
      break;
    }
    case "day": {
      let cur = startOfDay(window.start);
      while (cur <= window.end) {
        columns.push({
          key: `d-${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`,
          label: String(cur.getDate()),
          groupLabel: `${SHORT_MONTHS[cur.getMonth()]} ${cur.getFullYear()}`,
          start: new Date(cur),
          end: endOfDay(cur),
        });
        cur = addDays(cur, 1);
      }
      break;
    }
  }

  return columns;
}

// ─── Bar segment calculation ────────────────────────────────────────────

export function calculateBarSegments(
  activityStart: Date,
  activityEnd: Date,
  columns: TimeColumn[]
): BarSegment[] {
  const segments: BarSegment[] = [];

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    // Check overlap
    if (activityEnd < col.start || activityStart > col.end) continue;

    const colDuration = col.end.getTime() - col.start.getTime();
    if (colDuration === 0) continue;

    const overlapStart = Math.max(activityStart.getTime(), col.start.getTime());
    const overlapEnd = Math.min(activityEnd.getTime(), col.end.getTime());

    const startFraction = (overlapStart - col.start.getTime()) / colDuration;
    const endFraction = (overlapEnd - col.start.getTime()) / colDuration;

    const isStart = activityStart >= col.start && activityStart <= col.end;
    const isEnd = activityEnd >= col.start && activityEnd <= col.end;

    segments.push({
      columnIndex: i,
      isStart,
      isEnd,
      startFraction,
      endFraction,
    });
  }

  return segments;
}

// ─── Header groups ──────────────────────────────────────────────────────

export function generateHeaderGroups(columns: TimeColumn[]): HeaderGroup[] {
  if (columns.length === 0) return [];

  const groups: HeaderGroup[] = [];
  let currentLabel = columns[0].groupLabel;
  let currentSpan = 1;

  for (let i = 1; i < columns.length; i++) {
    if (columns[i].groupLabel === currentLabel) {
      currentSpan++;
    } else {
      groups.push({ label: currentLabel, span: currentSpan });
      currentLabel = columns[i].groupLabel;
      currentSpan = 1;
    }
  }
  groups.push({ label: currentLabel, span: currentSpan });

  return groups;
}

// ─── Window navigation ──────────────────────────────────────────────────

export function shiftWindow(window: TimeWindow, zoom: ZoomLevel, direction: "left" | "right"): TimeWindow {
  const sign = direction === "right" ? 1 : -1;

  switch (zoom) {
    case "year": {
      // Shift by 3 years
      return {
        start: new Date(window.start.getFullYear() + sign * 3, window.start.getMonth(), 1),
        end: new Date(window.end.getFullYear() + sign * 3, window.end.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    }
    case "quarter": {
      // Shift by 4 quarters (1 year)
      return {
        start: addMonths(window.start, sign * 12),
        end: new Date(addMonths(window.start, sign * 12 + 12).getFullYear(), addMonths(window.start, sign * 12 + 12).getMonth(), 0, 23, 59, 59, 999),
      };
    }
    case "month": {
      // Shift by 6 months
      const newStart = addMonths(window.start, sign * 6);
      const newEnd = addMonths(window.end, sign * 6);
      return {
        start: startOfMonth(newStart),
        end: endOfMonth(newEnd),
      };
    }
    case "week": {
      // Shift by 8 weeks
      return {
        start: addDays(window.start, sign * 56),
        end: addDays(window.end, sign * 56),
      };
    }
    case "day": {
      // Shift by 14 days
      return {
        start: addDays(window.start, sign * 14),
        end: addDays(window.end, sign * 14),
      };
    }
  }
}

export function defaultWindowForZoom(zoom: ZoomLevel, centerDate?: Date): TimeWindow {
  const center = centerDate || new Date();

  switch (zoom) {
    case "year":
      return {
        start: new Date(center.getFullYear() - 1, 0, 1),
        end: new Date(center.getFullYear() + 3, 11, 31, 23, 59, 59, 999),
      };
    case "quarter":
      return {
        start: startOfQuarter(new Date(center.getFullYear(), center.getMonth() - 6, 1)),
        end: endOfQuarter(new Date(center.getFullYear(), center.getMonth() + 9, 1)),
      };
    case "month": {
      const s = new Date(center.getFullYear(), center.getMonth() - 3, 1);
      const e = new Date(center.getFullYear(), center.getMonth() + 9, 0, 23, 59, 59, 999);
      return { start: startOfMonth(s), end: endOfMonth(e) };
    }
    case "week": {
      return {
        start: startOfWeek(addDays(center, -28)),
        end: endOfWeek(addDays(center, 56)),
      };
    }
    case "day": {
      return {
        start: startOfDay(addDays(center, -7)),
        end: endOfDay(addDays(center, 21)),
      };
    }
  }
}

export function windowToToday(zoom: ZoomLevel): TimeWindow {
  return defaultWindowForZoom(zoom, new Date());
}

export function fitWindowToActivities(
  activities: { startDate: string; endDate: string }[],
  zoom: ZoomLevel
): TimeWindow {
  if (activities.length === 0) return defaultWindowForZoom(zoom);

  const starts = activities.filter((a) => a.startDate).map((a) => parseDate(a.startDate).getTime());
  const ends = activities.filter((a) => a.endDate).map((a) => parseDate(a.endDate).getTime());

  if (starts.length === 0 && ends.length === 0) return defaultWindowForZoom(zoom);

  const allDates = [...starts, ...ends];
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));

  // Add padding
  switch (zoom) {
    case "year":
      return {
        start: new Date(minDate.getFullYear() - 1, 0, 1),
        end: new Date(maxDate.getFullYear() + 1, 11, 31, 23, 59, 59, 999),
      };
    case "quarter":
      return {
        start: startOfQuarter(addMonths(minDate, -3)),
        end: endOfQuarter(addMonths(maxDate, 3)),
      };
    case "month":
      return {
        start: startOfMonth(addMonths(minDate, -1)),
        end: endOfMonth(addMonths(maxDate, 1)),
      };
    case "week":
      return {
        start: startOfWeek(addDays(minDate, -14)),
        end: endOfWeek(addDays(maxDate, 14)),
      };
    case "day":
      return {
        start: startOfDay(addDays(minDate, -3)),
        end: endOfDay(addDays(maxDate, 3)),
      };
  }
}

// ─── Parse helpers ──────────────────────────────────────────────────────

export function parseDate(s: string): Date {
  // Expects "YYYY-MM-DD"
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateRange(window: TimeWindow): string {
  const s = window.start;
  const e = window.end;
  if (s.getFullYear() === e.getFullYear()) {
    return `${SHORT_MONTHS[s.getMonth()]} – ${SHORT_MONTHS[e.getMonth()]} ${s.getFullYear()}`;
  }
  return `${SHORT_MONTHS[s.getMonth()]} ${s.getFullYear()} – ${SHORT_MONTHS[e.getMonth()]} ${e.getFullYear()}`;
}

export function isToday(col: TimeColumn): boolean {
  const now = new Date();
  const today = startOfDay(now);
  return today >= col.start && today <= col.end;
}

// ─── Display helpers ────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Format a date as "Wed, 12 Jul 2026" */
export function formatDateLabel(d: Date): string {
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Format a start–end range as "Wed, 12 Jul 2026 – Fri, 12 Aug 2026" */
export function formatBarDateRange(startDate: string, endDate: string): string {
  return `${formatDateLabel(parseDate(startDate))} – ${formatDateLabel(parseDate(endDate))}`;
}

// ─── Drag helpers ───────────────────────────────────────────────────────

/** Convert a column + fraction-within-column to a calendar date (snapped to day). */
export function dateFromColumnFraction(column: TimeColumn, fraction: number): Date {
  const clamped = Math.max(0, Math.min(1, fraction));
  const ms = column.start.getTime() + clamped * (column.end.getTime() - column.start.getTime());
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Format a Date as "YYYY-MM-DD" for storing back into the model. */
export function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
