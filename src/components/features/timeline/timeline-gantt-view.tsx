"use client";

import { useState, useMemo } from "react";
import { TimelineActivity } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import {
  type ZoomLevel,
  type TimeWindow,
  generateColumns,
  generateHeaderGroups,
  calculateBarSegments,
  shiftWindow,
  windowToToday,
  fitWindowToActivities,
  parseDate,
  isToday,
  formatBarDateRange,
} from "@/lib/utils/timeline";
import { STAGE_COLORS, getStageColor, COLUMN_SIZES, ACTIVITY_COL_WIDTH } from "./timeline-gantt-constants";
import { TimelineToolbar } from "./timeline-toolbar";
import { TimelineGridHeader } from "./timeline-grid-header";

interface TimelineGanttViewProps {
  timeline: TimelineActivity[];
  compactMode?: boolean;
}

function ColorLegend() {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {Object.entries(STAGE_COLORS).map(([stage, colors]) => (
        <div key={stage} className="flex items-center gap-1.5">
          <div className={cn("w-3 h-3 rounded-sm", colors.bar)} />
          <span className="text-xs text-ptba-gray">{stage}</span>
        </div>
      ))}
    </div>
  );
}

export function TimelineGanttView({ timeline, compactMode = false }: TimelineGanttViewProps) {
  const [zoom, setZoom] = useState<ZoomLevel>("month");
  const [window, setWindow] = useState<TimeWindow>(() =>
    fitWindowToActivities(timeline, "month")
  );

  const columns = useMemo(() => generateColumns(zoom, window), [zoom, window]);
  const headerGroups = useMemo(() => generateHeaderGroups(columns), [columns]);
  const showGroupRow = zoom !== "year" && headerGroups.some((g) => g.label !== "");

  const handleZoomChange = (newZoom: ZoomLevel) => {
    setZoom(newZoom);
    if (timeline.length > 0) {
      setWindow(fitWindowToActivities(timeline, newZoom));
    } else {
      setWindow(windowToToday(newZoom));
    }
  };

  const handleShiftLeft = () => setWindow((w) => shiftWindow(w, zoom, "left"));
  const handleShiftRight = () => setWindow((w) => shiftWindow(w, zoom, "right"));
  const handleToday = () => setWindow(windowToToday(zoom));

  if (timeline.length === 0) {
    return <p className="text-sm text-ptba-gray italic">No timeline activities yet</p>;
  }

  const gridCols = `${ACTIVITY_COL_WIDTH} repeat(${columns.length}, ${COLUMN_SIZES[zoom]})`;

  return (
    <div>
      {!compactMode && <ColorLegend />}
      {!compactMode && (
        <TimelineToolbar
          zoom={zoom}
          window={window}
          onZoomChange={handleZoomChange}
          onShiftLeft={handleShiftLeft}
          onShiftRight={handleShiftRight}
          onToday={handleToday}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <div
          className="grid"
          style={{ gridTemplateColumns: gridCols, minWidth: compactMode ? "600px" : "900px" }}
        >
          <TimelineGridHeader
            columns={columns}
            headerGroups={headerGroups}
            showGroupRow={showGroupRow}
          />

          {/* Rows */}
          {timeline.map((item, rowIdx) => {
            const colors = getStageColor(item.stage);
            const segments = item.startDate && item.endDate
              ? calculateBarSegments(parseDate(item.startDate), parseDate(item.endDate), columns)
              : [];
            const dateLabel = item.startDate && item.endDate
              ? formatBarDateRange(item.startDate, item.endDate)
              : "";

            return (
              <div key={item.id} className="contents group">
                {/* Activity name cell */}
                <div
                  className={cn(
                    "px-4 py-3 sticky left-0 z-10 flex items-center gap-2 border-t border-gray-100",
                    rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-medium text-ptba-charcoal truncate", compactMode ? "text-xs" : "text-sm")}>{item.activity}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.stage && (
                        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", colors.bg, colors.text)}>
                          {item.stage}
                        </span>
                      )}
                      {!compactMode && item.estimatePeriod && (
                        <span className="text-[10px] text-ptba-gray">{item.estimatePeriod}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline cells */}
                {columns.map((col, colIdx) => {
                  const segment = segments.find((s) => s.columnIndex === colIdx);
                  const today = isToday(col);
                  const isLastSegment = segment?.isEnd;

                  return (
                    <div
                      key={col.key}
                      className={cn(
                        "relative px-0.5 py-3 border-t border-gray-100",
                        rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                        today && "bg-blue-50/30"
                      )}
                    >
                      {segment && (
                        <div
                          className={cn(
                            "absolute inset-y-2 transition-colors group/bar",
                            colors.bar,
                            segment.isStart && segment.isEnd && "rounded",
                            segment.isStart && !segment.isEnd && "rounded-l",
                            !segment.isStart && segment.isEnd && "rounded-r",
                            !segment.isStart && !segment.isEnd && "rounded-none"
                          )}
                          style={{
                            left: `${Math.max(segment.startFraction * 100, 1)}%`,
                            right: `${Math.max((1 - segment.endFraction) * 100, 1)}%`,
                          }}
                        >
                          {/* Always-visible date label after the bar end */}
                          {isLastSegment && dateLabel && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 pointer-events-none z-20">
                              <span className="whitespace-nowrap text-[10px] font-medium text-ptba-gray">
                                {dateLabel}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
