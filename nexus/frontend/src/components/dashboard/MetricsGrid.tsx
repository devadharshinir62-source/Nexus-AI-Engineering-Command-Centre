import React from 'react';
import { MetricSummary } from '../../types/dashboard';
import { StatCard } from '../common/StatCard';
import {
  Activity,
  FolderGit2,
  AlertCircle,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface MetricsGridProps {
  metrics: MetricSummary[];
  onSelectMetric?: (metricId: string) => void;
}

const metricIconMap: Record<string, typeof Activity> = {
  'project-health': Activity,
  'active-projects': FolderGit2,
  'open-issues': AlertCircle,
  'build-success-rate': CheckCircle2,
  'api-performance': Zap,
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, onSelectMetric }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const Icon = metricIconMap[metric.id] || Activity;
        return (
          <StatCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            change={metric.change}
            trend={metric.trend}
            timeframe={metric.timeframe}
            description={metric.description}
            icon={Icon}
            onClick={onSelectMetric ? () => onSelectMetric(metric.id) : undefined}
          />
        );
      })}
    </div>
  );
};
