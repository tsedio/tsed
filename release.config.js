module.exports = {
  branch: '4.x.x',
  verifyConditions: ['@semantic-release/github', '@semantic-release/npm'],
  analyzeCommits: ['@semantic-release/commit-analyzer'],
  verifyRelease: [],
  generateNotes: ['@semantic-release/release-notes-generator'],
  prepare: ['@semantic-release/npm', './tasks/semantic/repo.js', 'gflow/src/command/release'],
  publish: ['./tasks/semantic/repo.js', '@semantic-release/github'],
  success: ['@semantic-release/github', 'gflow/src/command/release', './tasks/semantic/repo.js'], // ,
  fail: ['@semantic-release/github'],
  npmPublish: false
};
