import React, { useState } from 'react';
import {
  Layers,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { PipelineProject, PipelineStage } from '../../types/dashboard';

interface WorkflowPipelineBoardProps {
  projects: PipelineProject[];
  onSelectProject: (project: PipelineProject) => void;
}

interface StageColumn {
  id: PipelineStage;
  label: string;
  badgeColor: string;
  borderColor: string;
  iconColor: string;
}

const STAGE_COLUMNS: StageColumn[] = [
  {
    id: 'research',
    label: 'Research',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    borderColor: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    id: 'development',
    label: 'Development',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    borderColor: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    id: 'review',
    label: 'Code Review',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    borderColor: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    id: 'security_review',
    label: 'Security Review',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    id: 'staging',
    label: 'Staging',
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'production',
    label: 'Production',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
];

export const WorkflowPipelineBoard: React.FC<WorkflowPipelineBoardProps> = ({
  projects,
  onSelectProject,
}) => {
  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');

  const filteredProjects =
    activeStageFilter === 'all'
      ? projects
      : projects.filter((p) => p.stage === activeStageFilter);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-2">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            AI Engineering Pipeline & Delivery Stages
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-0.5">
            Real-time Kanban workflow tracking projects across research, code review, security gating, and production
          </CardDescription>
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={() => setActiveStageFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              activeStageFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            All Stages ({projects.length})
          </button>
          {STAGE_COLUMNS.map((col) => {
            const count = projects.filter((p) => p.stage === col.id).length;
            const isSelected = activeStageFilter === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setActiveStageFilter(col.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? `${col.badgeColor} border font-semibold`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {col.label} ({count})
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* 6-Column Pipeline Grid */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-2 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 min-w-[1000px] xl:min-w-0">
          {STAGE_COLUMNS.map((column) => {
            const columnProjects = filteredProjects.filter((p) => p.stage === column.id);

            return (
              <div
                key={column.id}
                className={`flex flex-col rounded-xl border ${column.borderColor} bg-white/[0.015] p-2.5 min-h-[260px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      {column.label}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${column.badgeColor}`}>
                    {columnProjects.length}
                  </span>
                </div>

                {/* Projects Stack */}
                <div className="flex-1 space-y-2.5">
                  {columnProjects.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-3 border border-dashed border-white/[0.05] rounded-lg">
                      <span className="text-[11px] text-slate-500">No active projects</span>
                    </div>
                  ) : (
                    columnProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => onSelectProject(project)}
                        className="group relative rounded-lg border border-white/[0.08] bg-[#0E1424]/90 p-3 hover:border-cyan-500/40 hover:bg-[#11192e] transition-all cursor-pointer shadow-xs hover:shadow-cyan-500/5"
                      >
                        {/* Top: Title & Repo */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {project.name}
                          </h4>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm font-semibold shrink-0 ${
                              project.riskLevel === 'high'
                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                                : project.riskLevel === 'medium'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {project.riskLevel}
                          </span>
                        </div>

                        {/* Repo Slug */}
                        <div className="text-[10px] font-mono text-cyan-400/80 mb-2 truncate">
                          {project.repository}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                            <span>Progress</span>
                            <span className="text-slate-200 font-semibold">{project.progressPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${project.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer: Owner & Health */}
                        <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={project.owner.avatar}
                              alt={project.owner.name}
                              className="h-4 w-4 rounded-full border border-white/[0.1] object-cover"
                            />
                            <span className="text-slate-300 font-medium truncate max-w-[80px]">
                              {project.owner.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 font-mono">
                            <span className="text-slate-400">Health</span>
                            <span className="text-emerald-400 font-bold">{project.healthScore}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
