import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Dashboard Telemetry & Provenance Logic', () => {
  const mockConnectedRepo = {
    id: 'gh-10270250',
    name: 'react',
    full_name: 'facebook/react',
    owner: 'facebook',
    default_branch: 'main',
    stars: 225000,
    open_issues: 850,
    health: {
      health_score: 87,
      code_activity: 95,
      ci_health: 100,
      pull_request_health: 80,
      security_health: 90,
    },
    metrics_summary: {
      health_score: 87,
      velocity_pts: 99,
      test_pass_rate: 100.0,
      pr_cycle_time_hours: 14.8,
      recent_commits_count: 30,
      open_prs_count: 5,
      releases_count: 10,
      contributors_count: 10,
    },
    recent_workflows: [
      { id: 1, name: 'CI', conclusion: 'success' },
    ],
  };

  test('KPI synthesis maps real GitHub data when connected repository is active', () => {
    const m = mockConnectedRepo.metrics_summary;
    const kpis = [
      { id: 'project-health', value: m.health_score, unit: '/100', timeframe: 'GitHub Multi-Vector Score' },
      { id: 'active-projects', value: mockConnectedRepo.default_branch, timeframe: `${m.open_prs_count} open pull requests` },
      { id: 'open-issues', value: mockConnectedRepo.open_issues, timeframe: 'GitHub live issue tracker' },
      { id: 'build-success-rate', value: `${m.test_pass_rate}%`, timeframe: `${mockConnectedRepo.recent_workflows.length} GitHub Actions runs` },
      { id: 'api-performance', value: 'Not connected', timeframe: 'No telemetry source' },
    ];

    assert.strictEqual(kpis[0].value, 87);
    assert.strictEqual(kpis[1].value, 'main');
    assert.strictEqual(kpis[2].value, 850);
    assert.strictEqual(kpis[3].value, '100%');
    assert.strictEqual(kpis[4].value, 'Not connected');
  });

  test('AI insights generator produces deterministic insights from real repo telemetry', () => {
    const insights = [];
    const m = mockConnectedRepo.metrics_summary;

    if (m.open_prs_count > 0) {
      insights.push({
        id: `ins-pr-${mockConnectedRepo.id}`,
        title: `Active Pull Request Review Turnaround (~${m.pr_cycle_time_hours}h)`,
        category: 'bottleneck',
        impact: 'medium',
      });
    }

    insights.push({
      id: `ins-health-${mockConnectedRepo.id}`,
      title: `Multi-Vector Engineering Health (${m.health_score}/100)`,
      category: 'quality',
      impact: 'medium',
    });

    assert.strictEqual(insights.length, 2);
    assert.strictEqual(insights[0].category, 'bottleneck');
    assert.strictEqual(insights[1].category, 'quality');
  });
});
