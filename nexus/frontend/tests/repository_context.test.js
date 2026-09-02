import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Repository Context & Dynamic Aggregation Logic', () => {
  const DEFAULT_DEMO_REPOSITORIES = [
    { id: 'all', name: 'all', displayName: 'All Repositories' },
    { id: 'nexus-api-gateway', name: 'nexus-api-gateway', displayName: 'nexus-api-gateway' },
    { id: 'nexus-web-client', name: 'nexus-web-client', displayName: 'nexus-web-client' },
    { id: 'nexus-auth-core', name: 'nexus-auth-core', displayName: 'nexus-auth-core' },
    { id: 'nexus-billing-engine', name: 'nexus-billing-engine', displayName: 'nexus-billing-engine' },
  ];

  test('combines demo repositories with connected real GitHub repositories', () => {
    const connectedRepos = [
      {
        id: 'gh-10270250',
        name: 'react',
        full_name: 'facebook/react',
        stars: 225000,
        health: { health_score: 87 },
      },
      {
        id: 'gh-9999',
        name: 'fastapi',
        full_name: 'fastapi/fastapi',
        stars: 85000,
        health: { health_score: 92 },
      },
    ];

    const totalCount = DEFAULT_DEMO_REPOSITORIES.length - 1 + connectedRepos.length;
    const combined = [
      {
        id: 'all',
        name: 'all',
        displayName: `All Repositories (${totalCount})`,
      },
      ...DEFAULT_DEMO_REPOSITORIES.slice(1),
      ...connectedRepos.map((cr) => ({
        id: cr.name,
        name: cr.name,
        displayName: `${cr.full_name} ★${cr.stars}`,
        isRealGitHub: true,
        stars: cr.stars,
        healthScore: cr.health.health_score,
      })),
    ];

    assert.strictEqual(combined.length, 7);
    assert.strictEqual(combined[0].displayName, 'All Repositories (6)');
    assert.strictEqual(combined[5].name, 'react');
    assert.strictEqual(combined[5].isRealGitHub, true);
    assert.strictEqual(combined[6].name, 'fastapi');
  });

  test('active repository lookup correctly identifies connected GitHub repo', () => {
    const connectedRepos = [
      { id: 'gh-10270250', name: 'react', full_name: 'facebook/react', default_branch: 'main' },
    ];
    const selectedRepo = 'react';

    const active = connectedRepos.find((r) => r.name === selectedRepo || r.full_name === selectedRepo) || null;
    assert.notStrictEqual(active, null);
    assert.strictEqual(active?.full_name, 'facebook/react');
  });
});
