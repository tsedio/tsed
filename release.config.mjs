process.env.SEMANTIC_RELEASE_PACKAGE = "Ts.ED";

export default {
  branches: [
    "v7"
  ],
  verifyConditions: [
    "@semantic-release/github",
    "@semantic-release/npm",
    "@tsed/monorepo-utils/semantic-release",
    "semantic-release-slack-bot"
  ],
  analyzeCommits: ["@semantic-release/commit-analyzer"],
  verifyRelease: [],
  generateNotes: ["@semantic-release/release-notes-generator"],
  prepare: ["@semantic-release/npm", "@tsed/monorepo-utils/semantic-release"],
  publish: ["@tsed/monorepo-utils/semantic-release", "@semantic-release/github"],
  success: [
    "@semantic-release/github",
    "@tsed/monorepo-utils/semantic-release",
    [
      "semantic-release-slack-bot",
      {
        markdownReleaseNotes: true,
        notifyOnSuccess: true
      }
    ]
  ],
  fail: ["@semantic-release/github"],
  npmPublish: false
};
