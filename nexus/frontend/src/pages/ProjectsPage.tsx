import React, { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import { Project } from '../types/project';
import { PipelineProject } from '../types/dashboard';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { WorkflowPipelineBoard } from '../components/dashboard/WorkflowPipelineBoard';
import { ProjectDetailModal } from '../components/dashboard/ProjectDetailModal';
import { useRepository } from '../context/RepositoryContext';
import { formatRelativeTime } from '../utils/formatters';
import {
  FolderGit2,
  Search,
  Plus,
  GitBranch,
  Star,
  GitFork,
  Users,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle2,
  X,
  Layers,
  LayoutGrid,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { selectedRepo, connectedRepositories, setIsConnectModalOpen } = useRepository();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pipelineProjects, setPipelineProjects] = useState<PipelineProject[]>([]);
  const [selectedPipelineProject, setSelectedPipelineProject] = useState<PipelineProject | null>(null);
  const [viewMode, setViewMode] = useState<'pipeline' | 'repositories'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  useEffect(() => {
    DashboardService.getProjects().then((baseProjects) => {
      // Merge real connected GitHub repositories
      const mappedConnected: Project[] = connectedRepositories.map((cr) => ({
        id: cr.id,
        name: cr.name,
        slug: cr.name,
        description: cr.description || 'Live connected GitHub repository analyzed by NEXUS.',
        repositoryUrl: cr.url,
        provider: 'github',
        defaultBranch: cr.default_branch,
        language: cr.language || 'Codebase',
        healthScore: cr.health.health_score,
        openIssuesCount: cr.open_issues,
        openPullRequestsCount: cr.metrics_summary.open_prs_count,
        lastSyncedAt: cr.analyzed_at,
        starsCount: cr.stars,
        forksCount: cr.forks,
        tags: ['GitHub Live', 'Analyzed', cr.language || 'Codebase'],
        activeContributors: cr.metrics_summary.contributors_count,
      }));
      setProjects([...mappedConnected, ...baseProjects]);
    });
    DashboardService.getPipelineProjects(selectedRepo).then(setPipelineProjects);
  }, [selectedRepo, connectedRepositories]);

  const languages = ['all', ...Array.from(new Set(projects.map((p) => p.language)))];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = selectedLanguage === 'all' || p.language === selectedLanguage;
    const matchesRepo = selectedRepo === 'all' || p.name.toLowerCase().includes(selectedRepo.toLowerCase());
    return matchesSearch && matchesLanguage && matchesRepo;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-cyan-400" />
              Engineering Projects & Workflow Pipelines
            </h2>
            {selectedRepo !== 'all' && (
              <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                Scope: {selectedRepo}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time delivery stages, connected repository indexing, and multi-branch telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5 text-xs">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Pipeline Board
            </button>
            <button
              onClick={() => setViewMode('repositories')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'repositories'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Repositories ({filteredProjects.length})
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsConnectModalOpen(true)}
            className="text-xs"
          >
            Connect Repo
          </Button>
        </div>
      </div>

      {/* Main View: Pipeline vs Repositories */}
      {viewMode === 'pipeline' ? (
        <WorkflowPipelineBoard
          projects={pipelineProjects}
          onSelectProject={(p) => setSelectedPipelineProject(p)}
        />
      ) : (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#0E1424]/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">Language:</span>
              <div className="flex items-center gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                variant="interactive"
                className="flex flex-col justify-between p-5 space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-white tracking-tight">
                          {project.name}
                        </span>
                        <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                          {project.language}
                        </Badge>
                      </div>
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 font-mono transition-colors"
                      >
                        <span>{project.repositoryUrl.replace('https://', '')}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 font-mono">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{project.healthScore}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">Health Score</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-white/[0.06]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <GitBranch className="h-3 w-3 text-cyan-400" />
                      {project.defaultBranch}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Users className="h-3 w-3 text-purple-400" />
                      {project.activeContributors} devs
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Star className="h-3 w-3 text-amber-400" />
                      {project.starsCount}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <GitFork className="h-3 w-3 text-slate-400" />
                      {project.forksCount}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Synced {formatRelativeTime(project.lastSyncedAt)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedPipelineProject}
        isOpen={!!selectedPipelineProject}
        onClose={() => setSelectedPipelineProject(null)}
      />
    </div>
  );
};
