"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Activity } from "lucide-react";
import { EnergyProject } from "@/lib/types";

interface ProgressMonitoringFormProps {
  project: EnergyProject;
}

export function ProgressMonitoringForm({ project }: ProgressMonitoringFormProps) {
  const [form, setForm] = useState(project.progressMonitoring);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    alert("Progress Monitoring saved successfully!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Activity className="w-4 h-4 text-ptba-green" />
          <h3 className="font-semibold text-ptba-navy text-sm">Progress Report</h3>
        </div>
        <Textarea
          value={form.progressReport}
          onChange={(e) => handleChange("progressReport", e.target.value)}
          placeholder="Enter progress report..."
          className="min-h-[180px]"
        />
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
          Report
        </h3>
        <Textarea
          value={form.report}
          onChange={(e) => handleChange("report", e.target.value)}
          placeholder="Enter detailed report..."
          className="min-h-[180px]"
        />
      </Card>

      <div className="flex justify-end">
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
