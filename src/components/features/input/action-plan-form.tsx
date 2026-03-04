"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, ClipboardList } from "lucide-react";
import { EnergyProject, ActionPlanItem } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface ActionPlanFormProps {
  project: EnergyProject;
}

export function ActionPlanForm({ project }: ActionPlanFormProps) {
  const [rows, setRows] = useState<ActionPlanItem[]>(project.actionPlan);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `a${Date.now()}`,
        kegiatan: "",
        issues: "",
        sample: "",
        actionPlan: "",
        targetWaktu: "",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = () => {
    alert("Action Plan saved successfully!");
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="px-5 py-3 bg-ptba-section-bg border-b border-gray-100 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-ptba-navy" />
          <h3 className="font-semibold text-ptba-navy text-sm">Action Plan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ptba-navy text-white">
                <th className="px-3 py-3 text-left text-xs font-semibold min-w-[150px]">Kegiatan</th>
                <th className="px-3 py-3 text-left text-xs font-semibold min-w-[150px]">Issues</th>
                <th className="px-3 py-3 text-left text-xs font-semibold min-w-[120px]">Sample</th>
                <th className="px-3 py-3 text-left text-xs font-semibold min-w-[200px]">Action Plan</th>
                <th className="px-3 py-3 text-left text-xs font-semibold min-w-[100px]">Target Waktu</th>
                <th className="px-2 py-3 w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-gray-100",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  )}
                >
                  <td className="px-3 py-2">
                    <input
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white"
                      value={row.kegiatan}
                      onChange={(e) => updateRow(row.id, "kegiatan", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white"
                      value={row.issues}
                      onChange={(e) => updateRow(row.id, "issues", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white"
                      value={row.sample}
                      onChange={(e) => updateRow(row.id, "sample", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white"
                      value={row.actionPlan}
                      onChange={(e) => updateRow(row.id, "actionPlan", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white"
                      value={row.targetWaktu}
                      onChange={(e) => updateRow(row.id, "targetWaktu", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="p-1 text-gray-400 hover:text-ptba-red transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ptba-steel-blue hover:text-ptba-navy transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
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
