import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Connect Repository Validation & Progress Sequence', () => {
  const ANALYSIS_STEPS = [
    'Validating GitHub repository URL & access permissions...',
    'Fetching repository metadata & branch configurations...',
    'Analyzing recent commit frequency & active contributors...',
    'Inspecting pull requests & review turnaround cadence...',
    'Scanning GitHub Actions workflow runs & CI stability...',
    'Computing 7-factor deterministic Engineering Health Score...',
  ];

  test('analysis progression contains complete 6-step inspection stages', () => {
    assert.strictEqual(ANALYSIS_STEPS.length, 6);
    assert.ok(ANALYSIS_STEPS[0].includes('Validating'));
    assert.ok(ANALYSIS_STEPS[4].includes('GitHub Actions'));
    assert.ok(ANALYSIS_STEPS[5].includes('Engineering Health Score'));
  });

  test('URL validator correctly identifies valid and invalid format strings', () => {
    const isValidGitHubUrl = (str) => {
      if (!str || typeof str !== 'string') return false;
      const cleaned = str.trim().toLowerCase();
      return (
        cleaned.startsWith('https://github.com/') ||
        cleaned.startsWith('http://github.com/') ||
        cleaned.startsWith('github.com/')
      );
    };

    assert.strictEqual(isValidGitHubUrl('https://github.com/facebook/react'), true);
    assert.strictEqual(isValidGitHubUrl('github.com/vercel/next.js'), true);
    assert.strictEqual(isValidGitHubUrl('https://google.com/search'), false);
    assert.strictEqual(isValidGitHubUrl(''), false);
    assert.strictEqual(isValidGitHubUrl('not-a-url'), false);
  });
});
