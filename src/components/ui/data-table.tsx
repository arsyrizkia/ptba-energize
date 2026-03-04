"use client";

import { cn } from "@/lib/utils/cn";

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-gray-200", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-ptba-navy text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-ptba-gray"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  "border-t border-gray-100 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                  "hover:bg-ptba-section-bg/50"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-ptba-charcoal">
                    {col.render
                      ? col.render(item, index)
                      : String(item[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
