import React from 'react';
import {
  Activity,
  Server,
  Zap,
  Gauge,
  AlertTriangle,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { ObservabilityMetrics } from '../../types/dashboard';

interface ServiceHealthObservabilityProps {
  metrics: ObservabilityMetrics;
}

export const ServiceHealthObservability: React.FC<ServiceHealthObservabilityProps> = ({
  metrics,
}) => {
  const getStatusBadge = () => {
    switch (metrics.serviceHealthStatus) {
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            HEALTHY (99.98% SLA)
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            DEGRADED LATENCY
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            CRITICAL INCIDENT
          </span>
        );
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-2">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />
            Service Health & Telemetry Observability
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-0.5">
            Real-time proxy ingress, throughput metrics, P95/P99 latency bounds, and edge cache hit rates
          </CardDescription>
        </div>

        <div>{getStatusBadge()}</div>
      </CardHeader>

      <div className="p-4 pt-0 space-y-4">
        {/* Top 4 Primary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Requests */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                Total Requests
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +{metrics.requestsGrowth}%
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {metrics.totalRequests}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Ingress proxy volume (24h)
            </div>
          </div>

          {/* Throughput */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Throughput
              </span>
              <span className="text-[11px] font-mono text-slate-400">Live Rate</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {metrics.throughputReqSec}{' '}
              <span className="text-xs text-slate-400 font-normal">req/s</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Active concurrent requests: {metrics.runningRequests}
            </div>
          </div>

          {/* P95 / P99 Latency */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-purple-400" />
                P95 / P99 Latency
              </span>
              <span className="text-[11px] font-mono text-cyan-400">Avg {metrics.avgResponseTimeMs}ms</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight flex items-baseline gap-2">
              <span>{metrics.p95LatencyMs}ms</span>
              <span className="text-xs text-slate-400 font-normal">/ {metrics.p99LatencyMs}ms P99</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Under target budget (&lt;100ms)
            </div>
          </div>

          {/* Error Rate & Cache */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-emerald-400" />
                Cache Hit Rate
              </span>
              <span
                className={`text-[11px] font-mono font-semibold ${
                  metrics.errorRatePercent > 1 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {metrics.errorRatePercent}% err
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {metrics.cacheUtilizationPercent}%
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Redis cluster memory utilization
            </div>
          </div>
        </div>

        {/* Observability Telemetry Telemetry Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.01] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Container CPU Load</div>
                <div className="text-[11px] font-mono text-slate-400">32.4% avg across 16 nodes</div>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400">Optimal</div>
          </div>

          <div className="rounded-lg border border-white/[0.05] bg-white/[0.01] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-purple-500/10 text-purple-400">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Token Consumption</div>
                <div className="text-[11px] font-mono text-slate-400">{metrics.tokenConsumption || '2.16M tokens'}</div>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400">Tracked</div>
          </div>

          <div className="rounded-lg border border-white/[0.05] bg-white/[0.01] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Active Anomalies</div>
                <div className="text-[11px] font-mono text-slate-400">
                  {metrics.detectedProblems} telemetry warnings flagged
                </div>
              </div>
            </div>
            <div
              className={`text-xs font-mono font-bold ${
                metrics.detectedProblems > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {metrics.detectedProblems > 0 ? `${metrics.detectedProblems} Issues` : 'Clear'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
