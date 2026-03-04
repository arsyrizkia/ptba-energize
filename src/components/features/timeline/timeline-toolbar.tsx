"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ZoomLevel, TimeWindow } from "@/lib/utils/timeline";
import { formatDateRange } from "@/lib/utils/timeline";
import { ZOOM_LEVELS, ZOOM_LABELS } from "./timeline-gantt-constants";

interface TimelineToolbarProps {
  zoom: ZoomLevel;
  window: TimeWindow;
  onZoomChange: (zoom: ZoomLevel) => void;
  onShiftLeft: () => void;
  onShiftRight: () => void;
  onToday: () => void;
}

export function TimelineToolbar({
  zoom,
  window: tw,
  onZoomChange,
  onShiftLeft,
  onShiftRight,
  onToday,
}: TimelineToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onShiftLeft}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-ptba-gray hover:text-ptba-navy"
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-medium text-ptba-charcoal min-w-[180px] text-center">
          {formatDateRange(tw)}
        </span>

        <button
          onClick={onShiftRight}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-ptba-gray hover:text-ptba-navy"
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onToday}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-ptba-gray hover:text-ptba-navy ml-1"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          Today
        </button>
      </div>

      {/* Zoom selector */}
      <div className="flex p-0.5 bg-gray-100 rounded-lg">
        {ZOOM_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onZoomChange(level)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
              zoom === level
                ? "bg-ptba-navy text-white shadow-sm"
                : "text-ptba-gray hover:text-ptba-navy"
            )}
          >
            {ZOOM_LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  );
}
