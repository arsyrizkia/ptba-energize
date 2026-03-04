"use client";

import Link from "next/link";
import { MapPin, Zap, ArrowRight, Sun, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnergyProject, ProjectStatus } from "@/lib/types";

const statusVariant: Record<ProjectStatus, "warning" | "success" | "info" | "neutral"> = {
  "On Progress": "warning",
  Completed: "success",
  Planning: "info",
  "On Hold": "neutral",
};

function ProjectIcon({ name }: { name: string }) {
  const isSolar = name.toLowerCase().includes("plts");
  return isSolar ? (
    <Sun className="w-8 h-8 text-ptba-gold" />
  ) : (
    <Flame className="w-8 h-8 text-ptba-red" />
  );
}

function getGradient(name: string): string {
  if (name.toLowerCase().includes("plts") && name.toLowerCase().includes("ikn")) {
    return "from-emerald-500/10 via-teal-500/5 to-transparent";
  }
  if (name.toLowerCase().includes("plts")) {
    return "from-amber-500/10 via-orange-500/5 to-transparent";
  }
  return "from-slate-500/10 via-red-500/5 to-transparent";
}

interface ProjectCardProps {
  project: EnergyProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { overview, status } = project;

  return (
    <Card hover className="overflow-hidden group">
      {/* Image/Visual Header */}
      <div className={`h-36 bg-gradient-to-br ${getGradient(overview.projectName)} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,58,92,0.06),transparent_50%)]" />
        <ProjectIcon name={overview.projectName} />
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariant[status]}>
            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
            {status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-ptba-navy text-[15px] mb-2 leading-snug">
          {overview.projectName}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-ptba-gray">
            <MapPin className="w-3.5 h-3.5 text-ptba-steel-blue shrink-0" />
            <span>{overview.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-ptba-gray">
            <Zap className="w-3.5 h-3.5 text-ptba-gold shrink-0" />
            <span className="font-medium text-ptba-charcoal">{overview.capacity}</span>
          </div>
        </div>

        <p className="text-xs text-ptba-gray leading-relaxed line-clamp-2 mb-4">
          {overview.description}
        </p>

        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ptba-steel-blue hover:text-ptba-navy transition-colors group/link"
        >
          Read More
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </Card>
  );
}
