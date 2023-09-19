const slackURL = "https://api.tsed.io/rest/slack/tsedio/tsed";
const defaultTiersItems = [
  `Github <a class="text-blue hover:text-blue-active underline" href="https://github.com/tsedio/tsed/issues" target="_blank">issues</a>`,
  `Github <a class="text-blue hover:text-blue-active underline" href="https://github.com/tsedio/tsed/discussions" target="_blank">discussions</a>`,
  `Slack <a class="text-blue hover:text-blue-active underline" href="${slackURL}" target=\"_blank\">public channel</a>`,
  "Voting for new features"
];

function getTiers(wording = "Free") {
  return [
    {
      title: "Individual",
      category: "Starter",
      description: "Premium support for individuals and non-profit organizations",
      items: [
        `<strong>${wording} options</strong>`,
        "+",
        "Sponsor badge",
        "<strong>Slack private</strong> channel",
        "<strong>Direct message</strong> to the author",
        "<strong>Earlier access</strong> to private packages",
        "<strong>Prioritized</strong> issues",
        "Submit new features",
        "Hosted private packages on our repository",
        "Your name / logo will appear on the Ts.ED website as sponsor!"
      ],
      price: {
        amount: "$25",
        by: "per month"
      },
      cta: {
        label: "Get started",
        url: "https://github.com/sponsors/Romakita/sponsorships?sponsor=Romakita&tier_id=69641&preview=false"
      }
    },
    {
      title: "Company",
      category: "Premium",
      description: "Premium support for company<br />startup, small business...",
      items: [
        `<strong>${wording} options</strong>`,
        "+",
        "Sponsor badge",
        "<strong>Slack private</strong> channel",
        "<strong>Direct message</strong> to the author",
        "<strong>Earlier access</strong> to private packages",
        "<strong>Prioritized</strong> issues",
        "Submit new features",
        "Hosted private packages on our repository",
        "Your name / logo will appear on the Ts.ED website as sponsor!"
      ],
      price: {
        amount: "$50",
        by: "per month"
      },
      cta: {
        label: "Get started",
        url: "https://github.com/sponsors/Romakita/sponsorships?sponsor=Romakita&tier_id=69642&preview=false"
      }
    },
    {
      title: "Company +",
      category: "Golden",
      description: 'Now I have an answer to the question "Are you wasting time on GitHub again?"',
      highlight: true,
      items: [
        "<strong>Company options</strong>",
        "+",
        "<strong>Dedicated slack</strong> private channel",
        "<strong>Technical support</strong> (hangout, audio/video)",
        "Ask for personalized features",
        "Code review"
      ],
      price: {
        amount: "$100",
        by: "per month"
      },
      cta: {
        label: "Get started",
        url: "https://github.com/sponsors/Romakita/sponsorships?sponsor=Romakita&tier_id=161983&preview=false"
      }
    }
  ];
}

module.exports = require("./config.base")({
  title: "Ts.ED - A Node.js and TypeScript Framework on top of Express/Koa.js.",
  description:
    "A Node.js and TypeScript Framework on top of Express/Koa.js. It provides a lot of decorators and guidelines to write your code.",
  url: "https://tsed.io",
  apiRedirectUrl: "https://api-docs.tsed.io",
  themeConfig: {
    offers: {
      supports: {
        title: "Support pricing",
        description: "Support the Open-Source project by getting a premium support!",
        legalInfo: "Prices include taxes - It use github sponsors.",
        items: [
          {
            title: "Free",
            category: "Community",
            description: "Share your issues with the community<br /><br />",
            startHere: true,
            items: defaultTiersItems,
            price: {
              amount: "$0",
              by: "per month"
            },
            cta: {
              label: "Open Slack",
              url: "Slack URL"
            }
          },
          ...getTiers()
        ]
      },
      additionalServices: {
        items: [
          {
            title: "Support",
            category: "One time",
            description: "You have a problem that requires quick attention.<br /><br />",
            items: ["Audio/Video", "Share screen", "Share repository", "1 hour consulting, mentorship or pair-programming session"],
            price: {
              amount: "$100",
              by: "one time"
            },
            cta: {
              label: "Get started",
              url: "https://github.com/sponsors/Romakita/sponsorships?sponsor=Romakita&tier_id=68164&preview=false"
            }
          },
          {
            title: "Create POC",
            category: "Development",
            description: "I'll bootstrap a POC for you that match your needs.<br /><br />",
            items: [
              "Discuss about your needs on a private slack channel / e-mail",
              "Cost and time evaluation",
              "I take 1 minimum hour to create the repository with the source code that match your needs"
            ],
            price: {
              amount: "$250",
              by: "start from"
            },
            cta: {
              label: "Contact us",
              url: "https://form.typeform.com/to/uJLP7anG"
            }
          },
          {
            title: "Audit",
            category: "Consulting",
            description: "You develop your application on the Ts.ED framework and you want an expert opinion on your code.",
            items: ["Audit and Code review", "Improvement proposal", "Audio / video playback possible (hangout, Teams, etc...)"],
            price: {
              amount: "$800",
              by: "one time"
            },
            cta: {
              label: "Contact us",
              url: "https://form.typeform.com/to/uJLP7anG"
            }
          }
        ]
      },
      sponsors: {
        title: "Support us",
        description: "Support the Open-Source project by becoming an official sponsor and enjoy the benefits that this includes!",
        legalInfo: "Prices include taxes - It use github sponsors.",
        items: [
          {
            title: "Supporter",
            category: "Community",
            description: "You are just an holy person who wants to support my work out of pure goodness. 🙏🏻",
            startHere: true,
            items: defaultTiersItems,
            price: {
              amount: "$7",
              by: "per month"
            },
            cta: {
              label: "Get started",
              url: "https://github.com/sponsors/Romakita/sponsorships?sponsor=Romakita&tier_id=36063&preview=false"
            }
          },
          ...getTiers("Supporter")
        ]
      }
    },
    backers: {
      cta: {
        label: "Become backer",
        url: "https://opencollective.com/tsed#backers"
      }
    },
    sponsors: {
      classes: null,
      title: "Support us",
      description:
        "Ts.ED is under MIT-license and is an open-source project. Many thanks to our sponsors, partners and backers who contribute to promote and support our project!",
      cta: {
        label: "Become sponsor",
        url: "/sponsors.html"
      },
      items: [
        {
          title: "Premium sponsors",
          class: "w-1/2 sm:w-1/6 px-5 py-3",
          style: {
            maxHeight: "150px"
          },
          items: [
            {
              title: "Zenika",
              href: "https://www.zenika.com",
              src: "https://zenika-website.cdn.prismic.io/zenika-website/4e73b102-9045-4cff-b098-a0625f7d10f8_logo_light.svg"
            },
            {
              title: "Weseek",
              href: "https://weseek.co.jp/",
              src: "https://avatars.githubusercontent.com/u/6468105?v=4"
            }
          ]
        },
        {
          title: "Partners",
          class: "w-1/3 sm:w-1/6 px-5 py-3",
          style: {
            maxHeight: "90px"
          },
          items: [
            {
              title: "schnell.digital",
              href: "https://schnell.digital/",
              src: "/partners/schnell.svg"
            }
          ]
        }
      ]
    }
  }
});
