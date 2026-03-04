"use client";

import { useState } from "react";
import {
  PenSquare,
  FileText,
  Clock,
  DollarSign,
  ShieldAlert,
  Scale,
  ClipboardList,
  Activity,
  Database,
  ChevronDown,
} from "lucide-react";
import { mockProjects } from "@/lib/mock-data/projects";
import { ProjectOverviewForm } from "@/components/features/input/project-overview-form";
import { IndicativeTimelineForm } from "@/components/features/input/indicative-timeline-form";
import { IndicativeFinancialForm } from "@/components/features/input/indicative-financial-form";
import { RiskManagementForm } from "@/components/features/input/risk-management-form";
import { LegalAspectForm } from "@/components/features/input/legal-aspect-form";
import { ActionPlanForm } from "@/components/features/input/action-plan-form";
import { ProgressMonitoringForm } from "@/components/features/input/progress-monitoring-form";
import { ExternalDataForm } from "@/components/features/input/external-data-form";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { id: "overview", label: "Project Overview", icon: FileText },
  { id: "timeline", label: "Indicative Timeline", icon: Clock },
  { id: "financial", label: "Indicative Financial", icon: DollarSign },
  { id: "risk", label: "Risk Management", icon: ShieldAlert },
  { id: "legal", label: "Legal Aspect", icon: Scale },
  { id: "action", label: "Action Plan", icon: ClipboardList },
  { id: "progress", label: "Progress Monitoring", icon: Activity },
  { id: "external", label: "External Data", icon: Database },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function InputPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id);

  const selectedProject = mockProjects.find((p) => p.id === selectedProjectId) || mockProjects[0];

  const renderForm = () => {
    switch (activeTab) {
      case "overview":
        return <ProjectOverviewForm project={selectedProject} />;
      case "timeline":
        return <IndicativeTimelineForm project={selectedProject} />;
      case "financial":
        return <IndicativeFinancialForm project={selectedProject} />;
      case "risk":
        return <RiskManagementForm project={selectedProject} />;
      case "legal":
        return <LegalAspectForm project={selectedProject} />;
      case "action":
        return <ActionPlanForm project={selectedProject} />;
      case "progress":
        return <ProgressMonitoringForm project={selectedProject} />;
      case "external":
        return <ExternalDataForm project={selectedProject} />;
    }
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ptba-steel-blue/10 flex items-center justify-center">
            <PenSquare className="w-5 h-5 text-ptba-steel-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ptba-navy">Input Data</h1>
            <p className="text-sm text-ptba-gray">
              Enter and manage project data
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="relative">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm font-medium text-ptba-navy cursor-pointer hover:border-ptba-steel-blue transition-colors min-w-[260px]"
          >
            {mockProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.overview.projectName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ptba-gray pointer-events-none" />
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-white rounded-xl border border-gray-100 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
                activeTab === tab.id
                  ? "bg-ptba-navy text-white shadow-sm"
                  : "text-ptba-gray hover:text-ptba-navy hover:bg-ptba-section-bg"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="animate-fade-in-up" key={`${activeTab}-${selectedProjectId}`}>
        {renderForm()}
      </div>
    </div>
  );
}
