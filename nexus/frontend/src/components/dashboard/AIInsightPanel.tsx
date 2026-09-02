import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AIInsight } from '../../types/dashboard';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Gauge,
  CheckCheck,
  FolderGit2,
} from 'lucide-react';

interface AIInsightPanelProps {
  insights: AIInsight[];
  onExploreInsight?: (insight: AIInsight) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  bottleneck: Clock,
  security: ShieldAlert,
  architecture: FolderGit2,
  velocity: Gauge,
  quality: CheckCheck,
  performance: Gauge,
  reliability: Clock,
  deployment: Sparkles,
};

const impactVariantMap = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'primary' as const,
};

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
  insights,
  onExploreInsight,
}) => {
  return (
    <Card variant="glow" className="flex flex-col h-full border-cyan-500/20 shadow-glow-cyan">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-cyan-300 font-semibold text-sm">
              AI Engineering Insights
            </CardTitle>
            <Badge variant="cyan" size="sm" className="font-mono py-0 text-[10px]">
              Active Engine
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-400 mt-1">
            Continuous neural analysis across commits, PR bottlenecks, and security boundaries
          </CardDescription>
        </div>

        <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 whitespace-nowrap">
          {insights.length} Actionable Recommendations
        </span>
      </CardHeader>

      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[480px] xl:max-h-[500px] pr-1">
        {insights.map((insight) => {
          const CategoryIcon = categoryIcons[insight.category] || Sparkles;
          return (
            <div
              key={insight.id}
              className="rounded-xl border border-white/[0.08] bg-[#0E1424]/90 p-4 transition-all duration-200 hover:border-cyan-500/30 hover:bg-[#121B30] group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-cyan-400 group-hover:bg-cyan-500/10 shrink-0">
                    <CategoryIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors truncate">
                      {insight.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                      <span>{formatRelativeTime(insight.timestamp)}</span>
                      <span>•</span>
                      <span className="text-cyan-400/90 font-medium">
                        {insight.confidenceScore}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant={impactVariantMap[insight.impact]} size="sm" className="uppercase text-[10px] shrink-0 font-mono">
                  {insight.impact} impact
                </Badge>
              </div>

              <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                {insight.description}
              </p>

              {/* Action Recommendation Box */}
              <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5 text-xs text-cyan-100 flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-cyan-300 mr-1.5">Action:</span>
                  <span className="text-slate-300">{insight.recommendation}</span>
                </div>
              </div>

              {/* Repositories Tagging & Action */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.05] gap-2">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  {insight.affectedRepositories.map((repo) => (
                    <span
                      key={repo}
                      className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-400 border border-white/[0.06] truncate max-w-[140px]"
                    >
                      {repo}
                    </span>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="xs"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => onExploreInsight && onExploreInsight(insight)}
                  className="text-cyan-400 hover:text-cyan-300 shrink-0 text-xs py-0.5 px-2"
                >
                  Investigate
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
