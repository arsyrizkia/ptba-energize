import type { ZoomLevel } from "@/lib/utils/timeline";

export const STAGE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Study:     { bg: "bg-blue-50",    text: "text-blue-700",    bar: "bg-blue-500" },
  Licensing: { bg: "bg-amber-50",   text: "text-amber-700",   bar: "bg-amber-500" },
  EPC:       { bg: "bg-purple-50",  text: "text-purple-700",  bar: "bg-purple-500" },
  Build:     { bg: "bg-orange-50",  text: "text-orange-700",  bar: "bg-orange-500" },
  Testing:   { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
  Agreement: { bg: "bg-cyan-50",    text: "text-cyan-700",    bar: "bg-cyan-500" },
};

export const DEFAULT_STAGE_COLOR = { bg: "bg-gray-50", text: "text-gray-700", bar: "bg-gray-400" };

export function getStageColor(stage: string) {
  return STAGE_COLORS[stage] || DEFAULT_STAGE_COLOR;
}

export const ZOOM_LEVELS: ZoomLevel[] = ["year", "quarter", "month", "week", "day"];

export const COLUMN_SIZES: Record<ZoomLevel, string> = {
  year: "minmax(100px, 1fr)",
  quarter: "minmax(80px, 1fr)",
  month: "minmax(56px, 1fr)",
  week: "minmax(44px, 1fr)",
  day: "minmax(32px, 1fr)",
};

export const ACTIVITY_COL_WIDTH = "220px";

export const ZOOM_LABELS: Record<ZoomLevel, string> = {
  year: "Year",
  quarter: "Quarter",
  month: "Month",
  week: "Week",
  day: "Day",
};
