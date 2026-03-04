import Link from "next/link";
import { mockProjects } from "@/lib/mock-data/projects";
import { ProjectCard } from "@/components/features/dashboard/project-card";
import { Zap, FolderOpen, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-ptba-gold/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-ptba-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ptba-navy">Dashboard</h1>
            <p className="text-sm text-ptba-gray">
              Energy project portfolio overview
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-ptba-steel-blue/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-ptba-steel-blue" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ptba-navy">{mockProjects.length}</p>
            <p className="text-xs text-ptba-gray">Total Projects</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-ptba-gold" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ptba-navy">
              {mockProjects.filter((p) => p.status === "On Progress").length}
            </p>
            <p className="text-xs text-ptba-gray">On Progress</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-ptba-steel-blue" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ptba-navy">
              {mockProjects.filter((p) => p.status === "Planning").length}
            </p>
            <p className="text-xs text-ptba-gray">Planning</p>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {/* Add New Project Card */}
        <Link
          href="/projects/new"
          className="group rounded-xl border-2 border-dashed border-gray-200 bg-white/50 hover:border-ptba-steel-blue hover:bg-ptba-section-bg/30 transition-all duration-200 flex flex-col items-center justify-center min-h-[280px] cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-ptba-section-bg group-hover:bg-ptba-steel-blue/10 flex items-center justify-center transition-colors mb-4">
            <Plus className="w-7 h-7 text-ptba-gray group-hover:text-ptba-steel-blue transition-colors" />
          </div>
          <p className="text-sm font-semibold text-ptba-gray group-hover:text-ptba-navy transition-colors">
            Add New Project
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Create a new energy project
          </p>
        </Link>
      </div>
    </div>
  );
}
