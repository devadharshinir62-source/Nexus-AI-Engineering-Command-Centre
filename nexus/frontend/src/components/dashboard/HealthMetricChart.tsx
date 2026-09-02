import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { HealthMetricPoint } from '../../types/dashboard';
import { Activity, Zap, CheckCircle2, Rocket, GitCommit, Clock, Gauge, AlertTriangle } from 'lucide-react';

export type ChartMetricMode =
  | 'healthScore'
  | 'velocity'
  | 'testPassRate'
  | 'deploymentFrequency'
  | 'codeCommits'
  | 'prCycleTimeHours'
  | 'apiLatencyMs'
  | 'errorRatePercent';

interface HealthMetricChartProps {
  data: HealthMetricPoint[];
  timeRange?: '7d' | '14d' | '30d';
  onTimeRangeChange?: (range: '7d' | '14d' | '30d') => void;
}

const METRIC_CONFIGS: Record<
  ChartMetricMode,
  {
    label: string;
    unit: string;
    icon: React.ComponentType<{ className?: string }>;
    stroke: string;
    fill: string;
    domain: [number | 'auto', number | 'auto'];
    formatter: (val: number) => string;
  }
> = {
  healthScore: {
    label: 'Health Score',
    unit: 'score',
    icon: Activity,
    stroke: '#38BDF8',
    fill: '#0284C7',
    domain: [60, 100],
    formatter: (v) => `${v}/100`,
  },
  velocity: {
    label: 'Velocity',
    unit: 'pts',
    icon: Zap,
    stroke: '#A855F7',
    fill: '#7E22CE',
    domain: [0, 'auto'],
    formatter: (v) => `${v} pts`,
  },
  testPassRate: {
    label: 'Test Pass %',
    unit: '%',
    icon: CheckCircle2,
    stroke: '#34D399',
    fill: '#059669',
    domain: [80, 100],
    formatter: (v) => `${v}%`,
  },
  deploymentFrequency: {
    label: 'Deployment Frequency',
    unit: 'deploys',
    icon: Rocket,
    stroke: '#60A5FA',
    fill: '#2563EB',
    domain: [0, 'auto'],
    formatter: (v) => `${v} deploys/day`,
  },
  codeCommits: {
    label: 'Code Commits',
    unit: 'commits',
    icon: GitCommit,
    stroke: '#F472B6',
    fill: '#DB2777',
    domain: [0, 'auto'],
    formatter: (v) => `${v} commits`,
  },
  prCycleTimeHours: {
    label: 'PR Cycle Time',
    unit: 'hrs',
    icon: Clock,
    stroke: '#FBBF24',
    fill: '#D97706',
    domain: [0, 'auto'],
    formatter: (v) => `${v} hrs`,
  },
  apiLatencyMs: {
    label: 'API Latency',
    unit: 'ms',
    icon: Gauge,
    stroke: '#22D3EE',
    fill: '#0891B2',
    domain: [0, 'auto'],
    formatter: (v) => `${v} ms`,
  },
  errorRatePercent: {
    label: 'Error Rate',
    unit: '%',
    icon: AlertTriangle,
    stroke: '#F87171',
    fill: '#DC2626',
    domain: [0, 'auto'],
    formatter: (v) => `${v}%`,
  },
};

export const HealthMetricChart: React.FC<HealthMetricChartProps> = ({
  data,
  timeRange = '7d',
  onTimeRangeChange,
}) => {
  const [metricMode, setMetricMode] = useState<ChartMetricMode>('healthScore');
  const [selectedRange, setSelectedRange] = useState<'7d' | '14d' | '30d'>(timeRange);

  const activeConfig = METRIC_CONFIGS[metricMode];

  const handleRangeSelect = (range: '7d' | '14d' | '30d') => {
    setSelectedRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  // Compute live average, peak, and current
  const { average, peak, current } = useMemo(() => {
    if (!data || data.length === 0) return { average: '0', peak: '0', current: '0' };
    const values = data.map((d) => (d[metricMode] !== undefined ? Number(d[metricMode]) : 0));
    const sum = values.reduce((acc, v) => acc + v, 0);
    const avgVal = sum / values.length;
    const peakVal = Math.max(...values);
    const currentVal = values[values.length - 1];

    return {
      average: activeConfig.formatter(Number(avgVal.toFixed(1))),
      peak: activeConfig.formatter(Number(peakVal.toFixed(1))),
      current: activeConfig.formatter(Number(currentVal.toFixed(1))),
    };
  }, [data, metricMode, activeConfig]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-1">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            Engineering Pulse & Health Dynamics
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-0.5">
            Multi-vector telemetry tracking codebase reliability, sprint velocity, and test suite stability
          </CardDescription>
        </div>

        {/* Time Selectors */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5 text-xs">
            {(['7d', '14d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleRangeSelect(range)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                  selectedRange === range
                    ? 'bg-white/[0.12] text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      {/* 8-Metric Horizontal Pill Strip */}
      <div className="px-4 pb-2 -mt-1 overflow-x-auto scrollbar-none flex items-center gap-1.5 border-b border-white/[0.04]">
        {(Object.keys(METRIC_CONFIGS) as ChartMetricMode[]).map((mode) => {
          const cfg = METRIC_CONFIGS[mode];
          const isSelected = metricMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setMetricMode(mode)}
              className={`px-2.5 py-1 rounded-md font-medium text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-white/[0.08] text-white border border-white/[0.15] shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: isSelected ? cfg.stroke : 'transparent' }}
              />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Recharts Area Container */}
      <div className="flex-1 w-full min-w-0 min-h-[200px] pt-2 px-2">
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradientDynamic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConfig.stroke} stopOpacity={0.35} />
                <stop offset="95%" stopColor={activeConfig.fill} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              domain={activeConfig.domain}
              tickFormatter={(val) => `${val}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                fontSize: '12px',
                color: '#F8FAFC',
              }}
              formatter={(value: any) => [activeConfig.formatter(Number(value)), activeConfig.label]}
              itemStyle={{ color: activeConfig.stroke, fontWeight: 600 }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
            />

            <Area
              type="monotone"
              dataKey={metricMode}
              name={activeConfig.label}
              stroke={activeConfig.stroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#metricGradientDynamic)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="mt-2 mx-4 flex items-center justify-between border-t border-white/[0.05] pt-2.5 pb-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeConfig.stroke }} />
            Current: <span className="text-white font-semibold">{current}</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            Average: <span className="text-slate-200 font-semibold">{average}</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            Peak: <span className="text-emerald-400 font-semibold">{peak}</span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Sample Frequency: 15m</span>
      </div>
    </Card>
  );
};
