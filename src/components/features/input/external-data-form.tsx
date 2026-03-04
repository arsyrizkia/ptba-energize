"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Database, Send } from "lucide-react";
import { EnergyProject } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface ExternalDataFormProps {
  project: EnergyProject;
}

type SubTab = "technical" | "submission";

export function ExternalDataForm({ project }: ExternalDataFormProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("technical");
  const [technical, setTechnical] = useState(project.externalData.technicalStudy);
  const [submission, setSubmission] = useState(project.externalData.submission);

  const handleTechnicalChange = (field: string, value: string) => {
    setTechnical((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmissionChange = (field: string, value: string) => {
    setSubmission((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    alert("External Data saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-100 w-fit">
        <button
          onClick={() => setActiveSubTab("technical")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeSubTab === "technical"
              ? "bg-ptba-navy text-white shadow-sm"
              : "text-ptba-gray hover:text-ptba-navy hover:bg-ptba-section-bg"
          )}
        >
          <Database className="w-3.5 h-3.5" />
          Technical Study
        </button>
        <button
          onClick={() => setActiveSubTab("submission")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeSubTab === "submission"
              ? "bg-ptba-navy text-white shadow-sm"
              : "text-ptba-gray hover:text-ptba-navy hover:bg-ptba-section-bg"
          )}
        >
          <Send className="w-3.5 h-3.5" />
          Submission
        </button>
      </div>

      {activeSubTab === "technical" ? (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
            Technical Study
          </h3>
          <Textarea
            label="Project Certification"
            value={technical.projectCertification}
            onChange={(e) => handleTechnicalChange("projectCertification", e.target.value)}
          />
          <Textarea
            label="Technical Report"
            value={technical.technicalReport}
            onChange={(e) => handleTechnicalChange("technicalReport", e.target.value)}
          />
          <Textarea
            label="Demand Analysis"
            value={technical.demandAnalysis}
            onChange={(e) => handleTechnicalChange("demandAnalysis", e.target.value)}
          />
          <Textarea
            label="Terminal Spin"
            value={technical.terminalSpin}
            onChange={(e) => handleTechnicalChange("terminalSpin", e.target.value)}
          />
        </Card>
      ) : (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
            Submission
          </h3>
          <Textarea
            label="PTBA Description"
            value={submission.ptbaDescription}
            onChange={(e) => handleSubmissionChange("ptbaDescription", e.target.value)}
          />
          <Textarea
            label="PTBA Goals"
            value={submission.ptbaGoals}
            onChange={(e) => handleSubmissionChange("ptbaGoals", e.target.value)}
          />
          <Textarea
            label="EBD Initiatives"
            value={submission.ebdInitiatives}
            onChange={(e) => handleSubmissionChange("ebdInitiatives", e.target.value)}
          />
          <Textarea
            label="Strategic"
            value={submission.strategic}
            onChange={(e) => handleSubmissionChange("strategic", e.target.value)}
          />
        </Card>
      )}

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
