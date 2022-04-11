module.exports = {
  branches: [
    "production",
    {name: "alpha", prerelease: true, channel: "alpha"},
    {name: "beta", prerelease: true, channel: "beta"},
    {name: "rc", prerelease: true, channel: "rc"}
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
        notifyOnSuccess: true,
        onSuccessTemplate: {
          text: "Ts.ED v$npm_package_version has been released at https://github.com/tsedio/tsed/releases/tag/v$npm_package_version"
        }
      }
    ]
  ],
  fail: ["@semantic-release/github"],
  npmPublish: false
};
