const getRepoInfo = require("semantic-release-slack-bot/lib/getRepoInfo");
const slackifyMarkdown = require("slackify-markdown");

function onSuccessFunction(pluginConfig, context) {
  const {nextRelease, notes: releaseNotes, options} = context;
  const repo = getRepoInfo(options.repositoryUrl);
  const messageBlocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `A new version of \`Ts.ED\` has been released!\nCurrent version is *${nextRelease.version}*`
      }
    }
  ];

  const slackMessage = {
    blocks: messageBlocks
  };

  if (releaseNotes !== "") {
    messageBlocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: slackifyMarkdown(releaseNotes)
      }
    });
  }

  if (repo.path) {
    const gitTag = nextRelease.gitTag;
    const gitTagPrefix = repo.hostname.startsWith("gitlab") ? "/-/releases/" : "/releases/tag/";
    const gitTagUrl = repo.URL + gitTagPrefix + gitTag;

    slackMessage.attachments = [
      {
        color: "#2cbe4e",
        blocks: [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `:package: *<${repo.URL}|${repo.path}>:* <${gitTagUrl}|${gitTag}>`
              }
            ]
          }
        ]
      }
    ];
  }

  return slackMessage;
}

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
        onSuccessFunction,
        notifyOnSuccess: true
      }
    ]
  ],
  fail: ["@semantic-release/github"],
  npmPublish: false
};
