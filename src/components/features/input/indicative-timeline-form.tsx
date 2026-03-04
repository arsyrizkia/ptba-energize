"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Plus, Trash2, Save, Check, X, GripVertical } from "lucide-react";
import { EnergyProject, TimelineActivity } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import {
  type ZoomLevel,
  type TimeWindow,
  type TimeColumn,
  generateColumns,
  generateHeaderGroups,
  calculateBarSegments,
  shiftWindow,
  windowToToday,
  fitWindowToActivities,
  parseDate,
  isToday,
  dateFromColumnFraction,
  formatDateISO,
  formatBarDateRange,
} from "@/lib/utils/timeline";
import {
  STAGE_COLORS,
  getStageColor,
  COLUMN_SIZES,
  ACTIVITY_COL_WIDTH,
} from "@/components/features/timeline/timeline-gantt-constants";
import { TimelineToolbar } from "@/components/features/timeline/timeline-toolbar";
import { TimelineGridHeader } from "@/components/features/timeline/timeline-grid-header";

interface IndicativeTimelineFormProps {
  project: EnergyProject;
}

const STAGE_OPTIONS = Object.keys(STAGE_COLORS);

type DragType = "move" | "resize-start" | "resize-end" | "create";

interface DragState {
  rowId: string;
  type: DragType;
  originStartDate: string;
  originEndDate: string;
  startX: number;
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

/** Resolve which column + fraction the mouse is at given a grid container and clientX. */
function resolveColumnFromMouse(
  gridEl: HTMLElement,
  clientX: number,
  columns: TimeColumn[]
): { colIndex: number; fraction: number } | null {
  // Find all data-col-idx cells in the hovered row — but simpler: measure from grid
  const cells = gridEl.querySelectorAll<HTMLElement>("[data-col-idx]");
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const rect = cell.getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right) {
      const colIdx = Number(cell.dataset.colIdx);
      const rowId = cell.dataset.rowId;
      const fraction = (clientX - rect.left) / rect.width;
      return { colIndex: colIdx, fraction };
    }
  }
  return null;
}

/** Given a grid element, resolve column + fraction for a specific row */
function resolveColumnForRow(
  gridEl: HTMLElement,
  clientX: number,
  rowId: string,
  columns: TimeColumn[]
): { colIndex: number; fraction: number } | null {
  const cells = gridEl.querySelectorAll<HTMLElement>(`[data-col-idx][data-row-id="${rowId}"]`);
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const rect = cell.getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right) {
      const colIdx = Number(cell.dataset.colIdx);
      const fraction = (clientX - rect.left) / rect.width;
      return { colIndex: colIdx, fraction };
    }
  }

  // If mouse is beyond the last cell or before the first, clamp
  if (cells.length > 0) {
    const firstRect = cells[0].getBoundingClientRect();
    const lastCell = cells[cells.length - 1];
    const lastRect = lastCell.getBoundingClientRect();
    if (clientX < firstRect.left) {
      return { colIndex: Number(cells[0].dataset.colIdx), fraction: 0 };
    }
    if (clientX > lastRect.right) {
      return { colIndex: Number(lastCell.dataset.colIdx), fraction: 1 };
    }
  }

  return null;
}

export function IndicativeTimelineForm({ project }: IndicativeTimelineFormProps) {
  const [rows, setRows] = useState<TimelineActivity[]>(project.timeline);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const [zoom, setZoom] = useState<ZoomLevel>("month");
  const [window, setWindow] = useState<TimeWindow>(() =>
    rows.length > 0 ? fitWindowToActivities(rows, "month") : windowToToday("month")
  );

  const columns = useMemo(() => generateColumns(zoom, window), [zoom, window]);
  const headerGroups = useMemo(() => generateHeaderGroups(columns), [columns]);
  const showGroupRow = zoom !== "year" && headerGroups.some((g) => g.label !== "");

  const gridRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ─── Drag handlers ──────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (e: React.MouseEvent, rowId: string, type: DragType) => {
      e.preventDefault();
      e.stopPropagation();
      const row = rows.find((r) => r.id === rowId);
      if (!row) return;

      dragRef.current = {
        rowId,
        type,
        originStartDate: row.startDate,
        originEndDate: row.endDate,
        startX: e.clientX,
      };
      setIsDragging(true);
    },
    [rows]
  );

  const handleCellMouseDown = useCallback(
    (e: React.MouseEvent, rowId: string, colIdx: number) => {
      // Only create bar on empty cells (left click)
      if (e.button !== 0) return;
      const row = rows.find((r) => r.id === rowId);
      if (!row) return;
      // If bar already exists, don't create
      if (row.startDate && row.endDate) return;

      const col = columns[colIdx];
      if (!col) return;

      const cell = e.currentTarget as HTMLElement;
      const rect = cell.getBoundingClientRect();
      const fraction = (e.clientX - rect.left) / rect.width;
      const clickDate = dateFromColumnFraction(col, fraction);
      const dateStr = formatDateISO(clickDate);

      // Set start = end = clicked date, then start a resize-end drag
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId ? { ...r, startDate: dateStr, endDate: dateStr } : r
        )
      );

      dragRef.current = {
        rowId,
        type: "resize-end",
        originStartDate: dateStr,
        originEndDate: dateStr,
        startX: e.clientX,
      };
      setIsDragging(true);
    },
    [rows, columns]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag || !gridRef.current) return;

      const pos = resolveColumnForRow(gridRef.current, e.clientX, drag.rowId, columns);
      if (!pos) return;

      const col = columns[pos.colIndex];
      if (!col) return;

      const targetDate = dateFromColumnFraction(col, pos.fraction);
      const targetStr = formatDateISO(targetDate);

      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== drag.rowId) return r;

          switch (drag.type) {
            case "resize-start": {
              // Don't allow start after end
              const end = parseDate(drag.originEndDate);
              if (targetDate > end) return { ...r, startDate: drag.originEndDate };
              return { ...r, startDate: targetStr };
            }
            case "resize-end": {
              // Don't allow end before start
              const start = parseDate(r.startDate);
              if (targetDate < start) return { ...r, endDate: r.startDate };
              return { ...r, endDate: targetStr };
            }
            case "move": {
              const origStart = parseDate(drag.originStartDate);
              const origEnd = parseDate(drag.originEndDate);
              const duration = origEnd.getTime() - origStart.getTime();

              // Calculate delta from origin position
              const originPos = resolveColumnForRow(gridRef.current!, drag.startX, drag.rowId, columns);
              if (!originPos) return r;
              const originCol = columns[originPos.colIndex];
              if (!originCol) return r;
              const originDate = dateFromColumnFraction(originCol, originPos.fraction);

              const deltaMs = targetDate.getTime() - originDate.getTime();
              const newStart = new Date(origStart.getTime() + deltaMs);
              const newEnd = new Date(newStart.getTime() + duration);

              return {
                ...r,
                startDate: formatDateISO(newStart),
                endDate: formatDateISO(newEnd),
              };
            }
            default:
              return r;
          }
        })
      );
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, columns]);

  // ─── Other handlers ─────────────────────────────────────────────────

  const handleZoomChange = (newZoom: ZoomLevel) => {
    setZoom(newZoom);
    if (rows.length > 0) {
      setWindow(fitWindowToActivities(rows, newZoom));
    } else {
      setWindow(windowToToday(newZoom));
    }
  };

  const handleShiftLeft = () => setWindow((w) => shiftWindow(w, zoom, "left"));
  const handleShiftRight = () => setWindow((w) => shiftWindow(w, zoom, "right"));
  const handleToday = () => setWindow(windowToToday(zoom));

  const addRow = () => {
    const newRow: TimelineActivity = {
      id: `t${Date.now()}`,
      activity: "New Activity",
      startDate: "",
      endDate: "",
      stageActivity: "",
      stage: "",
      estimatePeriod: "",
    };
    setRows((prev) => [...prev, newRow]);
    setEditingId(newRow.id);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateRow = (id: string, field: keyof TimelineActivity, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = () => {
    alert("Indicative Timeline saved successfully!");
  };

  const gridCols = `${ACTIVITY_COL_WIDTH} repeat(${columns.length}, ${COLUMN_SIZES[zoom]})`;

  return (
    <div className="space-y-4">
      <ColorLegend />

      <TimelineToolbar
        zoom={zoom}
        window={window}
        onZoomChange={handleZoomChange}
        onShiftLeft={handleShiftLeft}
        onShiftRight={handleShiftRight}
        onToday={handleToday}
      />

      {/* Drag hint */}
      <p className="text-[11px] text-ptba-gray">
        Drag bar edges to resize, drag bar body to move, or click empty cells to create a bar.
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <div
          ref={gridRef}
          className={cn("grid min-w-[900px]", isDragging && "select-none")}
          style={{ gridTemplateColumns: gridCols }}
        >
          <TimelineGridHeader
            columns={columns}
            headerGroups={headerGroups}
            showGroupRow={showGroupRow}
          />

          {/* Rows */}
          {rows.map((row, rowIdx) => {
            const colors = getStageColor(row.stage);
            const isEditing = editingId === row.id;
            const isHovered = hoveredRow === row.id;

            const segments =
              row.startDate && row.endDate
                ? calculateBarSegments(parseDate(row.startDate), parseDate(row.endDate), columns)
                : [];
            const dateLabel = row.startDate && row.endDate
              ? formatBarDateRange(row.startDate, row.endDate)
              : "";

            return (
              <div key={row.id} className="contents">
                {/* Activity name cell */}
                <div
                  className={cn(
                    "px-3 py-2 sticky left-0 z-10 border-t border-gray-100 transition-colors",
                    rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                    isHovered && !isEditing && "bg-blue-50/50"
                  )}
                  onMouseEnter={() => !isDragging && setHoveredRow(row.id)}
                  onMouseLeave={() => !isDragging && setHoveredRow(null)}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        className="w-full px-2 py-1.5 text-xs font-medium border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-ptba-steel-blue"
                        value={row.activity}
                        onChange={(e) => updateRow(row.id, "activity", e.target.value)}
                        placeholder="Activity name"
                        autoFocus
                      />
                      <select
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-ptba-steel-blue"
                        value={row.stage}
                        onChange={(e) => updateRow(row.id, "stage", e.target.value)}
                      >
                        <option value="">Select stage...</option>
                        {STAGE_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-[10px] text-ptba-gray mb-0.5 block">Start</label>
                          <input
                            type="date"
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-ptba-steel-blue"
                            value={row.startDate}
                            onChange={(e) => updateRow(row.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-ptba-gray mb-0.5 block">End</label>
                          <input
                            type="date"
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-ptba-steel-blue"
                            value={row.endDate}
                            onChange={(e) => updateRow(row.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <input
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-ptba-steel-blue"
                        value={row.estimatePeriod}
                        onChange={(e) => updateRow(row.id, "estimatePeriod", e.target.value)}
                        placeholder="Est. period (e.g. 3 months)"
                      />
                      <div className="flex gap-1 pt-1">
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-white bg-ptba-steel-blue rounded hover:bg-ptba-navy transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Done
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-ptba-gray hover:text-ptba-charcoal transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="cursor-pointer" onClick={() => setEditingId(row.id)}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ptba-charcoal truncate">
                          {row.activity || "Untitled"}
                        </p>
                        {isHovered && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRow(row.id);
                            }}
                            className="p-0.5 text-gray-400 hover:text-ptba-red transition-colors shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {row.stage && (
                          <span
                            className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded",
                              colors.bg,
                              colors.text
                            )}
                          >
                            {row.stage}
                          </span>
                        )}
                        {row.estimatePeriod && (
                          <span className="text-[10px] text-ptba-gray">{row.estimatePeriod}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline cells */}
                {columns.map((col, colIdx) => {
                  const segment = segments.find((s) => s.columnIndex === colIdx);
                  const today = isToday(col);
                  const hasBar = row.startDate && row.endDate;

                  return (
                    <div
                      key={col.key}
                      data-col-idx={colIdx}
                      data-row-id={row.id}
                      className={cn(
                        "relative px-0.5 py-2 border-t border-gray-100 transition-colors",
                        rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                        isHovered && !segment && "bg-blue-50/20",
                        today && "bg-blue-50/30",
                        !hasBar && !isDragging && "cursor-crosshair"
                      )}
                      onMouseEnter={() => !isDragging && setHoveredRow(row.id)}
                      onMouseLeave={() => !isDragging && setHoveredRow(null)}
                      onMouseDown={(e) => {
                        if (!segment && !hasBar) {
                          handleCellMouseDown(e, row.id, colIdx);
                        }
                      }}
                    >
                      {segment && (
                        <div
                          className={cn(
                            "absolute inset-y-1.5 group/bar",
                            colors.bar,
                            segment.isStart && segment.isEnd && "rounded",
                            segment.isStart && !segment.isEnd && "rounded-l",
                            !segment.isStart && segment.isEnd && "rounded-r",
                            !segment.isStart && !segment.isEnd && "rounded-none",
                            isDragging && dragRef.current?.rowId === row.id
                              ? "opacity-80"
                              : "cursor-grab active:cursor-grabbing"
                          )}
                          style={{
                            left: `${Math.max(segment.startFraction * 100, 1)}%`,
                            right: `${Math.max((1 - segment.endFraction) * 100, 1)}%`,
                          }}
                          onMouseDown={(e) => handleDragStart(e, row.id, "move")}
                        >
                          {/* Left resize handle */}
                          {segment.isStart && (
                            <div
                              className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-10 group/handle"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleDragStart(e, row.id, "resize-start");
                              }}
                            >
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-white/60 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                            </div>
                          )}

                          {/* Right resize handle */}
                          {segment.isEnd && (
                            <div
                              className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-10 group/handle"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleDragStart(e, row.id, "resize-end");
                              }}
                            >
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-white/60 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                            </div>
                          )}

                          {/* Always-visible date label after the bar end */}
                          {segment.isEnd && dateLabel && (
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

      <div className="flex items-center justify-between">
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ptba-steel-blue hover:text-ptba-navy transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-ptba-navy text-white text-sm font-semibold rounded-lg hover:bg-ptba-navy-light transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Submit
        </button>
      </div>
    </div>
  );
}
