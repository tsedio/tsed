module.exports = {
  branches: [
    "production",
    {name: "alpha", prerelease: true, channel: "alpha"},
    {name: "beta", prerelease: true, channel: "beta"},
    {name: "rc", prerelease: true, channel: "rc"}
  ],
  verifyConditions: ["@semantic-release/github", "@semantic-release/npm", "@tsed/monorepo-utils/semantic-release"],
  analyzeCommits: ["@semantic-release/commit-analyzer"],
  verifyRelease: [],
  generateNotes: ["@semantic-release/release-notes-generator"],
  prepare: ["@semantic-release/npm", "@tsed/monorepo-utils/semantic-release"],
  publish: ["@tsed/monorepo-utils/semantic-release", "@semantic-release/github"],
  success: ["@semantic-release/github", "@tsed/monorepo-utils/semantic-release"],
  fail: ["@semantic-release/github"],
  npmPublish: false
};
