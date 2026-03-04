import { cn } from "@/lib/utils/cn";
import type { TimeColumn, HeaderGroup } from "@/lib/utils/timeline";
import { isToday } from "@/lib/utils/timeline";

interface TimelineGridHeaderProps {
  columns: TimeColumn[];
  headerGroups: HeaderGroup[];
  showGroupRow: boolean;
}

export function TimelineGridHeader({ columns, headerGroups, showGroupRow }: TimelineGridHeaderProps) {
  return (
    <>
      {/* Group row (year / month groups) */}
      {showGroupRow && (
        <>
          <div className="bg-ptba-navy text-white px-4 py-1.5 text-[10px] font-semibold sticky left-0 z-10 border-b border-white/10" />
          {headerGroups.map((group, gi) => (
            <div
              key={gi}
              className="bg-ptba-navy text-white px-1 py-1.5 text-center text-[10px] font-semibold border-b border-white/10 border-l border-l-white/10"
              style={{ gridColumn: `span ${group.span}` }}
            >
              {group.label}
            </div>
          ))}
        </>
      )}

      {/* Column labels row */}
      <div className="bg-ptba-navy text-white px-4 py-2.5 text-xs font-semibold sticky left-0 z-10">
        Activity
      </div>
      {columns.map((col) => {
        const today = isToday(col);
        return (
          <div
            key={col.key}
            className={cn(
              "bg-ptba-navy text-white px-1 py-2.5 text-center text-[10px] font-semibold border-l border-l-white/10",
              today && "bg-ptba-steel-blue"
            )}
          >
            {col.label}
          </div>
        );
      })}
    </>
  );
}
