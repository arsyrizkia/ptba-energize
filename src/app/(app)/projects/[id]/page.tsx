"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Zap,
  Calendar,
  TrendingUp,
  ShieldAlert,
  DollarSign,
  Sun,
  Flame,
  FileText,
  FileSpreadsheet,
  Presentation,
  Clock,
  Scale,
  ClipboardList,
  Activity,
  Database,
  FolderOpen,
  ImageIcon,
  PenLine,
  Plus,
  ArrowLeftCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectById, createEmptyProject } from "@/lib/mock-data/projects";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { EnergyProject, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ProjectOverviewForm } from "@/components/features/input/project-overview-form";
import { IndicativeTimelineForm } from "@/components/features/input/indicative-timeline-form";
import { IndicativeFinancialForm } from "@/components/features/input/indicative-financial-form";
import { RiskManagementForm } from "@/components/features/input/risk-management-form";
import { LegalAspectForm } from "@/components/features/input/legal-aspect-form";
import { ActionPlanForm } from "@/components/features/input/action-plan-form";
import { ProgressMonitoringForm } from "@/components/features/input/progress-monitoring-form";
import { ExternalDataForm } from "@/components/features/input/external-data-form";
import { ProjectDocumentsForm } from "@/components/features/input/project-documents-form";
import { TimelineGanttView } from "@/components/features/timeline/timeline-gantt-view";

const statusVariant: Record<ProjectStatus, "warning" | "success" | "info" | "neutral"> = {
  "On Progress": "warning",
  Completed: "success",
  Planning: "info",
  "On Hold": "neutral",
};

const formTabs = [
  { id: "edit-overview", label: "Project Info", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "financial", label: "Financial", icon: DollarSign },
  { id: "risk", label: "Risk Mgmt", icon: ShieldAlert },
  { id: "legal", label: "Legal", icon: Scale },
  { id: "action", label: "Action Plan", icon: ClipboardList },
  { id: "progress", label: "Progress", icon: Activity },
  { id: "external", label: "External Data", icon: Database },
  { id: "documents", label: "Documents", icon: FolderOpen },
] as const;

type FormTabId = (typeof formTabs)[number]["id"];
type PageMode = "view" | "edit";

function getOverviewFileIcon(fileType: string) {
  switch (fileType) {
    case "XLSX":
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    case "PPTX":
      return <Presentation className="w-4 h-4 text-ptba-orange" />;
    default:
      return <FileText className="w-4 h-4 text-ptba-red" />;
  }
}

function OverviewTab({ project, onEdit }: { project: EnergyProject; onEdit: (tab: FormTabId) => void }) {
  const { overview, financial, risks, timeline, documents } = project;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Project Image */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-ptba-navy flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-ptba-steel-blue" />
                Project Image
              </h2>
              <button onClick={() => onEdit("edit-overview")} className="text-ptba-steel-blue hover:text-ptba-navy transition-colors">
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </div>
            {overview.projectImage ? (
              <img
                src={overview.projectImage}
                alt={overview.projectName}
                className="w-full h-56 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-40 rounded-lg bg-ptba-section-bg/50 flex items-center justify-center">
                <p className="text-sm text-ptba-gray italic">No project image uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-ptba-navy">Description</h2>
              <button onClick={() => onEdit("edit-overview")} className="text-ptba-steel-blue hover:text-ptba-navy transition-colors">
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-ptba-charcoal leading-relaxed">
              {overview.description || <span className="text-ptba-gray italic">No description yet</span>}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-ptba-navy">Background</h2>
              <button onClick={() => onEdit("edit-overview")} className="text-ptba-steel-blue hover:text-ptba-navy transition-colors">
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-ptba-charcoal leading-relaxed">
              {overview.background || <span className="text-ptba-gray italic">No background yet</span>}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ptba-navy flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ptba-steel-blue" />
                Timeline
              </h2>
              <button onClick={() => onEdit("timeline")} className="text-ptba-steel-blue hover:text-ptba-navy transition-colors">
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </div>
            <TimelineGanttView timeline={timeline} compactMode />
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ptba-navy flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-ptba-steel-blue" />
                Documents
                {documents.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-ptba-section-bg text-ptba-gray">
                    {documents.length}
                  </span>
                )}
              </h2>
              <button onClick={() => onEdit("documents")} className="text-ptba-steel-blue hover:text-ptba-navy transition-colors">
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </div>
            {documents.length === 0 ? (
              <p className="text-sm text-ptba-gray italic">No documents uploaded yet</p>
            ) : (
              <div className="space-y-2">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-ptba-section-bg/50">
                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0">
                      {getOverviewFileIcon(doc.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ptba-navy truncate">{doc.title}</p>
                      <p className="text-[11px] text-ptba-gray">{doc.fileSize}</p>
                    </div>
                    <Badge variant="neutral" className="text-[10px] py-0 shrink-0">
                      {doc.fileType}
                    </Badge>
                  </div>
                ))}
                {documents.length > 3 && (
                  <button
                    onClick={() => onEdit("documents")}
                    className="w-full text-center text-xs text-ptba-steel-blue hover:text-ptba-navy font-medium py-2 rounded-lg hover:bg-ptba-section-bg/50 transition-colors"
                  >
                    View all {documents.length} documents
                  </button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-5">
              <h2 className="font-semibold text-ptba-navy mb-3">Key Advantage</h2>
              <p className="text-sm text-ptba-charcoal leading-relaxed">
                {overview.keyAdvantage || <span className="text-ptba-gray italic">Not specified</span>}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <h2 className="font-semibold text-ptba-navy mb-3">Competitive Advantage</h2>
              <p className="text-sm text-ptba-charcoal leading-relaxed">
                {overview.competitiveAdvantage || <span className="text-ptba-gray italic">Not specified</span>}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ptba-navy flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-ptba-gold" />
                Financial Summary
              </h2>
              <button onClick={() => onEdit("financial")} className="text-ptba-steel-blue hover:text-ptba-navy transition-colors">
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "NPV", value: formatCurrency(financial.npv) },
                { label: "IRR", value: formatPercentage(financial.irr), color: "text-ptba-green" },
                { label: "Payback Period", value: financial.paybackPeriod || "-" },
                { label: "WACC", value: formatPercentage(financial.waccCalculation) },
                { label: "CAPEX", value: formatCurrency(financial.capitalExpenditure) },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-ptba-gray">{item.label}</span>
                  <span className={cn("text-sm font-semibold", item.color || "text-ptba-navy")}>{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-ptba-gray">Tariff</span>
                <span className="text-xs font-medium text-ptba-charcoal text-right max-w-[150px]">
                  {financial.tariff || "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ptba-navy flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-ptba-orange" />
                Risk Overview
              </h2>
              <button onClick={() => onEdit("risk")} className="text-ptba-steel-blue hover:text-ptba-navy transition-colors">
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </div>
            {risks.length === 0 ? (
              <p className="text-sm text-ptba-gray italic">No risks identified yet</p>
            ) : (
              <div className="space-y-2">
                {risks.map((risk) => (
                  <div key={risk.id} className="p-3 rounded-lg bg-ptba-section-bg/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ptba-charcoal">{risk.riskArea}</span>
                      <Badge
                        variant={
                          risk.riskStatus === "High" ? "danger"
                            : risk.riskStatus === "Medium" ? "warning"
                            : "success"
                        }
                      >
                        {risk.riskStatus}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-ptba-gray">{risk.riskTreatment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <h2 className="font-semibold text-ptba-navy mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-ptba-green" />
              PLN Connection
            </h2>
            <p className="text-sm text-ptba-charcoal">
              {overview.plnConnection || <span className="text-ptba-gray italic">Not specified</span>}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const existingProject = isNew ? null : getProjectById(id);
  const project = existingProject || createEmptyProject();

  const [mode, setMode] = useState<PageMode>(isNew ? "edit" : "view");
  const [activeFormTab, setActiveFormTab] = useState<FormTabId>("edit-overview");

  const enterEditMode = (tab: FormTabId) => {
    setActiveFormTab(tab);
    setMode("edit");
  };

  const exitEditMode = () => {
    setMode("view");
  };

  if (!isNew && !existingProject) {
    return (
      <div className="p-8">
        <p className="text-ptba-gray">Project not found.</p>
        <Link href="/dashboard" className="text-ptba-steel-blue hover:underline text-sm mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { overview, status } = project;
  const isSolar = overview.projectName.toLowerCase().includes("plts");
  const hasName = overview.projectName.trim().length > 0;

  const renderFormContent = () => {
    switch (activeFormTab) {
      case "edit-overview":
        return <ProjectOverviewForm project={project} />;
      case "timeline":
        return <IndicativeTimelineForm project={project} />;
      case "financial":
        return <IndicativeFinancialForm project={project} />;
      case "risk":
        return <RiskManagementForm project={project} />;
      case "legal":
        return <LegalAspectForm project={project} />;
      case "action":
        return <ActionPlanForm project={project} />;
      case "progress":
        return <ProgressMonitoringForm project={project} />;
      case "external":
        return <ExternalDataForm project={project} />;
      case "documents":
        return <ProjectDocumentsForm project={project} />;
    }
  };

  return (
    <div className="p-8">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-ptba-gray hover:text-ptba-navy transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            isNew ? "bg-ptba-steel-blue/10" : "bg-ptba-section-bg"
          )}>
            {isNew ? (
              <Plus className="w-6 h-6 text-ptba-steel-blue" />
            ) : isSolar ? (
              <Sun className="w-6 h-6 text-ptba-gold" />
            ) : (
              <Flame className="w-6 h-6 text-ptba-red" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-ptba-navy">
                {isNew ? "New Project" : hasName ? overview.projectName : "Untitled Project"}
              </h1>
              {!isNew && (
                <Badge variant={statusVariant[status]}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {status}
                </Badge>
              )}
              {isNew && (
                <Badge variant="info">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  Draft
                </Badge>
              )}
            </div>
            {!isNew && hasName && (
              <div className="flex items-center gap-4 mt-2 text-sm text-ptba-gray">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-ptba-steel-blue" />
                  {overview.location || "No location set"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-ptba-gold" />
                  {overview.capacity || "No capacity set"}
                </span>
              </div>
            )}
            {isNew && (
              <p className="text-sm text-ptba-gray mt-1">
                Fill in the project details across each tab, then submit.
              </p>
            )}
          </div>

          {/* View/Edit mode toggle button */}
          {!isNew && (
            <div className="shrink-0">
              {mode === "view" ? (
                <button
                  onClick={() => enterEditMode("edit-overview")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-ptba-navy text-white text-sm font-semibold rounded-lg hover:bg-ptba-navy-light transition-colors shadow-sm"
                >
                  <PenLine className="w-4 h-4" />
                  Edit Project
                </button>
              ) : (
                <button
                  onClick={exitEditMode}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-ptba-gray text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftCircle className="w-4 h-4" />
                  Back to Overview
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Mode: Tab Bar */}
      {mode === "edit" && (
        <div className="flex gap-1 p-1 bg-white rounded-xl border border-gray-100 mb-6 overflow-x-auto">
          {formTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFormTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
                  isActive
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
      )}

      {/* Content */}
      <div key={mode === "view" ? "view" : activeFormTab} className="animate-fade-in-up">
        {mode === "view" ? (
          <OverviewTab project={project} onEdit={enterEditMode} />
        ) : (
          renderFormContent()
        )}
      </div>
    </div>
  );
}
