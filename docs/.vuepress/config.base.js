const markdown = require("@tsed/markdown-it-symbols");
const team = require("../../team.json");
const {version} = require("../../package");

const ALGOLIA = {
  apiKey: "9a1620e0f36bc5dc3b0982fdcbdd6f5f",
  indexName: "ts_ed",
  appId: "DH8VVM2E1E"
};

module.exports = ({title, description, base = "", url, apiRedirectUrl = "", themeConfig}) => ({
  title,
  description,
  url,
  theme: "tsed",
  head: [
    ["link", {canonical: url}],
    ["link", {rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon"}],
    ["link", {rel: "icon", href: "/favicon.ico", type: "apple-touch-icon"}],
    ["link", {rel: "icon", href: "/apple-touch-icon.png", type: "image/x-icon", sizes: "180x180"}],
    ["link", {rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32"}],
    ["link", {rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16"}],
    ["link", {rel: "manifest", href: "/site.webmanifest"}],
    ["meta", {property: "og:url", content: url}],
    ["meta", {property: "og:type", content: "website"}],
    ["meta", {property: "og:site_name", content: title}],
    ["meta", {property: "og:title", content: title}],
    ["meta", {property: "og:description", content: description}],
    ["meta", {property: "og:image", content: `${url}/tsed-og.png`}],
    ["meta", {property: "og:image:width", content: "1024"}],
    ["meta", {property: "og:image:height", content: "1024"}],
    ["meta", {name: "twitter:title", content: title}],
    ["meta", {name: "twitter:description", content: description}],
    ["meta", {name: "twitter:card", content: "summary"}],
    ["link", {rel: "preconnect", href: `https://${ALGOLIA.appId}-dsn.algolia.net`, crossOrigin: true}]
  ],
  themeConfig: {
    shortTitle: "Ts.ED",
    htmlTitle: "<strong class=\"font-medium\"><span class='text-blue'>Ts</span>.ED</strong>",
    version,
    team,
    licenseType: "MIT",
    author: "Lenzotti Romain",
    copyrightDates: {
      start: "2016",
      end: new Date().getFullYear()
    },
    repo: "tsedio/tsed",
    githubProxyUrl: "https://api.tsed.io/rest/github/tsedio/tsed",
    openCollective: "https://api.tsed.io/rest/opencollective",
    slackUrl: "https://api.tsed.io/rest/slack/tsedio/tsed",
    stackoverflowUrl: "https://stackoverflow.com/search?q=tsed",
    sponsorUrl: "https://tsed.io/support.html",
    twitterUrl: "https://twitter.com/TsED_io",
    editLinks: true,
    docsDir: "docs",
    sidebar: "auto",
    docsBranch: "production",
    apiUrl: "https://tsed.io/api.json",
    apiRedirectUrl,
    smoothScroll: true,
    lastUpdated: "Last updated",
    algolia: ALGOLIA,
    locales: {
      "/": {
        label: "English",
        selectText: "Languages",
        editLinkText: "Edit this page on GitHub",
        lastUpdated: "Last Updated",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        nav: [
          {
            text: "Getting started",
            link: `${base}/getting-started/`,
            title: `Getting started | ${title}`
          },
          {
            text: "Migration",
            link: `${base}/getting-started/migration-from-v6`,
            title: `Migrate from v6 | ${title}`
          },
          {
            text: "Documentation",
            link: `${base}/docs/controllers.html`,
            title: `Documentation | ${title}`,
            items: [
              {
                text: "Configuration",
                link: `${base}/docs/configuration.html`
              },
              {
                text: "Controllers",
                link: `${base}/docs/controllers.html`
              },
              {
                text: "Providers",
                link: `${base}/docs/providers.html`
              },
              {
                text: "Models",
                link: `${base}/docs/model.html`
              },
              {
                text: "Json Mapper",
                link: `${base}/docs/json-mapper.html`
              },
              {
                text: "Middlewares",
                link: `${base}/docs/middlewares.html`
              },
              {
                text: "Pipes",
                link: `${base}/docs/pipes.html`
              },
              {
                text: "Interceptors",
                link: `${base}/docs/interceptors.html`
              },
              {
                text: "Authentication",
                link: `${base}/docs/authentication.html`
              },
              {
                text: "Hooks",
                link: `${base}/docs/hooks.html`
              },
              {
                text: "Response filter",
                link: `${base}/docs/response-filter.html`
              },
              {
                text: "Exceptions",
                link: `${base}/docs/exceptions.html`
              },
              {
                text: "Logger",
                link: `${base}/docs/logger.html`
              },
              {
                text: "Context",
                link: `${base}/docs/request-context.html`
              },
              {
                text: "Cache",
                link: `${base}/docs/cache.html`
              },
              {
                text: "Platform API",
                link: `${base}/docs/platform-api.html`
              },
              {
                text: "Platform Serverless",
                link: `${base}/docs/platform-serverless.html`
              },
              {
                text: "Command",
                link: `${base}/docs/command.html`
              },
              {
                text: "Templating",
                link: `${base}/docs/templating.html`
              },
              {
                text: "Validation",
                link: `${base}/docs/validation.html`
              },
              {
                text: "Session & Cookies",
                link: `${base}/tutorials/session.html`
              },
              {
                text: "Testing",
                link: `${base}/docs/testing.html`
              }
            ]
          },
          {
            title: `Warehouse | ${title}`,
            text: "Warehouse",
            link: `${base}/warehouse/`,
            items: [
              {text: "Explore plugins", link: `${base}/warehouse/`},
              {text: "Project examples", link: `${base}/tutorials/`}
            ]
          },
          {
            title: `Tutorials | ${title}`,
            text: "Tutorials",
            link: `${base}/tutorials/`,
            items: [
              {
                text: "AJV",
                link: `${base}/tutorials/ajv.html`
              },
              {
                text: "AWS",
                link: `${base}/tutorials/aws.html`
              },
              {
                text: "Passport.js",
                link: `${base}/tutorials/passport.html`
              },
              {
                text: "Keycloak",
                link: `${base}/tutorials/keycloak.html`
              },
              {
                text: "Prisma",
                link: `${base}/tutorials/prisma.html`
              },
              {
                text: "MikroORM",
                link: `${base}/tutorials/mikroorm.html`
              },
              {
                text: "TypeORM",
                link: `${base}/tutorials/typeorm.html`
              },
              {
                text: "Mongoose",
                link: `${base}/tutorials/mongoose.html`
              },
              {
                text: "Objection.js",
                link: `${base}/tutorials/objection.html`
              },
              {
                text: "IORedis",
                link: `${base}/tutorials/ioredis.html`
              },
              {
                text: "GraphQL",
                link: `${base}/tutorials/graphql.html`
              },
              {
                text: "Socket.io",
                link: `${base}/tutorials/socket-io.html`
              },
              {
                text: "Swagger",
                link: `${base}/tutorials/swagger.html`
              },
              {
                text: "OIDC",
                link: `${base}/tutorials/oidc.html`
              },
              {
                text: "Stripe",
                link: `${base}/tutorials/stripe.html`
              },
              {
                text: "Server-sent events",
                link: `${base}/tutorials/server-sent events.html`
              },
              {
                text: "Agenda",
                link: `${base}/tutorials/agenda.html`
              },
              {
                text: "Serverless",
                link: `${base}/tutorials/serverless.html`
              },
              {
                text: "Temporal",
                link: `${base}/tutorials/temporal.html`
              },
              {
                text: "BullMQ",
                link: `${base}/tutorials/bullmq.html`
              },
              {
                text: "Terminus",
                link: `${base}/tutorials/terminus.html`
              },
              {
                text: "Vike",
                link: `${base}/tutorials/vike.html`
              },
              {
                text: "Jest",
                link: `${base}/tutorials/jest.html`
              },
              {
                text: "Vitest",
                link: `${base}/tutorials/vitest.html`
              },
              {
                text: "Pulse",
                link: `${base}/tutorials/pulse.html`
              }
            ].sort((a, b) => (a.text < b.text ? -1 : 1))
          },
          {
            icon: "bx bx-dots-horizontal-rounded text-lg",
            title: `Extras`,
            items: [
              {
                text: "Ts.ED CLI",
                link: "http://cli.tsed.io"
              },
              {
                text: "Ts.ED Logger",
                link: "http://logger.tsed.io"
              },
              {
                text: "Ts.ED Formio.js",
                link: "http://formio.tsed.io"
              },
              {
                text: "Team",
                link: `${base}/team.html`
              },
              {
                text: "Resources",
                link: `${base}/tutorials/`
              },
              {
                text: "Contributes",
                link: `${base}/contributing.html`
              },
              {
                text: "Support",
                link: `${base}/support.html`
              },
              {
                text: "Contact",
                link: `${base}/contact.html`
              },
              {
                text: "License",
                link: `${base}/license.html`
              },
              {
                text: "Api reference",
                link: `${apiRedirectUrl}/api.html`
              }
            ]
          },
          {
            title: "Current version",
            tag: "version",
            text: `v${version}`,
            position: "right",
            items: [
              {
                text: "v6 (maintenance)",
                link: "https://v6.tsed.io"
              },
              {
                text: "v5 (obsolete)",
                link: "http://v5.tsed.io"
              },
              {
                text: "v4 (obsolete)",
                link: "http://v4.tsed.io"
              }
            ]
          }
        ],
        sidebar: [
          {
            title: "Introduction", // required
            path: `${base}/getting-started/`,
            collapsable: true // optional, defaults to true
          },
          {title: "Create new project", path: base + "/getting-started/start-with-cli"},
          {title: "Create your first controller", path: base + "/getting-started/create-your-first-controller"},
          {
            title: "Migration",
            collapsable: true,
            children: [
              {
                title: "Migrate from v6",
                path: `https://tsed.io/getting-started/migration-from-v6`
              },
              {
                title: "Migrate from Express.js",
                path: `${base}/getting-started/migrate-from-express`
              }
            ]
          },
          {
            title: "Documentation",
            collapsable: true,
            children: [
              {title: "Configuration", path: base + "/docs/configuration"},
              {title: "Controllers", path: base + "/docs/controllers"},
              {title: "Providers", path: base + "/docs/providers"},
              {title: "Models", path: base + "/docs/model"},
              {title: "Json Mapper", path: base + "/docs/json-mapper"},
              {title: "Middlewares", path: base + "/docs/middlewares"},
              {title: "Pipes", path: base + "/docs/pipes"},
              {title: "Interceptors", path: base + "/docs/interceptors"},
              {title: "Authentication", path: base + "/docs/authentication"},
              {title: "Hooks", path: base + "/docs/hooks"},
              {title: "Response filter", path: base + "/docs/response-filter"},
              {title: "Exceptions", path: base + "/docs/exceptions"},
              {title: "Logger", path: base + "/docs/logger"},
              {title: "Context", path: base + "/docs/request-context"},
              {title: "Cache", path: base + "/docs/cache"},
              {title: "Platform API", path: base + "/docs/platform-api"},
              {title: "Platform Serverless", path: base + "/docs/platform-serverless"},
              {title: "Command", path: base + "/docs/command"},
              {title: "Templating", path: base + "/docs/templating"},
              {title: "Validation", path: base + "/docs/validation"},
              {title: "Session & Cookies", path: base + "/tutorials/session"},
              {title: "Testing", path: base + "/docs/testing"}
            ]
          },
          {
            title: "Advanced",
            collapsable: true,
            children: [
              {title: "Upload files", path: base + "/docs/upload-files"},
              {title: "Serve files", path: base + "/docs/serve-files"},
              {title: "Scopes injection", path: base + "/docs/injection-scopes"},
              {title: "Custom providers", path: base + "/docs/custom-providers"},
              {title: "Lazy-loading provider", path: base + "/docs/providers-lazy-loading"},
              {title: "Custom decorators", path: base + "/docs/custom-endpoint-decorators"},
              {title: "Throw HTTP exceptions", path: base + "/docs/throw-http-exceptions"},
              {title: "Customize 404", path: base + "/docs/not-found-page"}
            ]
          },
          {
            title: "Plugins",
            collapsable: true,
            children: [
              {title: "Passport", path: base + "/tutorials/passport"},
              {title: "Keycloak", path: base + "/tutorials/keycloak"},
              {title: "Prisma", path: base + "/tutorials/prisma"},
              {title: "Mikro ORM", path: base + "/tutorials/mikroorm"},
              {title: "TypeORM", path: base + "/tutorials/typeorm"},
              {title: "Mongoose", path: base + "/tutorials/mongoose"},
              {title: "GraphQL", path: base + "/tutorials/graphql"},
              {title: "Socket.io", path: base + "/tutorials/socket-io"},
              {title: "Open API", path: base + "/tutorials/swagger"},
              {title: "AJV", path: base + "/tutorials/ajv"},
              {title: "AWS", path: base + "/tutorials/aws"},
              {title: "OIDC", path: base + "/tutorials/oidc"},
              {title: "Stripe", path: base + "/tutorials/stripe"},
              {title: "Agenda", path: base + "/tutorials/agenda"},
              {title: "Terminus", path: base + "/tutorials/terminus"},
              {title: "Server-sent events", path: base + "/tutorials/server-sent-events"},
              {title: "Serverless", path: base + "/tutorials/serverless"},
              {title: "IORedis", path: base + "/tutorials/ioredis"},
              {title: "Objection.js", path: base + "/tutorials/objection"},
              {title: "Vike", path: base + "/tutorials/vike"},
              {title: "Jest", path: base + "/tutorials/jest"},
              {title: "Vitest", path: base + "/tutorials/vitest"},
              {title: "Temporal", path: base + "/tutorials/temporal"},
              {title: "BullMQ", path: base + "/tutorials/bullmq"},
              {title: "Pulse", path: base + "/tutorials/pulse"}
            ].sort((a, b) => (a.title < b.title ? -1 : 1))
          },
          {
            title: "Extras",
            children: [
              {title: "Our Team", path: base + "/team"},
              {title: "Tutorials", path: base + "/tutorials/"},
              {title: "Contributing", path: base + "/contributing"},
              {title: "Support us", path: base + "/support"},
              {title: "License", path: base + "/license"},
              {title: "API References", path: `${apiRedirectUrl}/api`}
            ]
          }
        ],
        otherTopics: [
          base + "/tutorials/session",
          base + "/tutorials/passport",
          base + "/tutorials/keycloak",
          base + "/tutorials/prisma",
          base + "/tutorials/typeorm",
          base + "/tutorials/mikroorm",
          base + "/tutorials/mongoose",
          base + "/tutorials/graphql",
          base + "/tutorials/graphql-ws",
          base + "/tutorials/graphql-apollo",
          base + "/tutorials/graphql-typegraphql",
          base + "/tutorials/graphql-nexus",
          base + "/tutorials/socket-io",
          base + "/tutorials/swagger",
          base + "/tutorials/ajv",
          base + "/tutorials/multer",
          base + "/tutorials/serve-static-files",
          base + "/tutorials/templating",
          base + "/tutorials/aws",
          base + "/tutorials/seq",
          base + "/tutorials/oidc",
          base + "/tutorials/stripe",
          base + "/tutorials/agenda",
          base + "/tutorials/terminus",
          base + "/tutorials/serverless",
          base + "/tutorials/server-sent-events",
          base + "/tutorials/ioredis",
          base + "/tutorials/vike",
          base + "/tutorials/jest",
          base + "/tutorials/vitest",
          base + "/docs/controllers",
          base + "/docs/providers",
          base + "/docs/model",
          base + "/docs/json-mapper",
          base + "/docs/middlewares",
          base + "/docs/pipes",
          base + "/docs/interceptors",
          base + "/docs/authentication",
          base + "/docs/hooks",
          base + "/docs/exceptions",
          base + "/docs/throw-http-exceptions",
          base + "/docs/cache",
          base + "/docs/command",
          base + "/docs/response-filter",
          base + "/docs/injection-scopes",
          base + "/docs/custom-providers",
          base + "/docs/providers-lazy-loading",
          base + "/docs/custom-endpoint-decorators",
          base + "/docs/testing",
          base + "/docs/not-found-page"
        ],
        footer: {
          sections: [
            {
              title: "Discover",
              items: [
                {
                  label: "Our team",
                  url: base + "/team.html"
                },
                {
                  label: "Contact us",
                  url: "https://form.typeform.com/to/uJLP7anG"
                }
              ]
            },
            {
              title: "Help",
              items: [
                {
                  label: "Resources",
                  url: base + "/tutorials/index.html"
                },
                {
                  label: "Chat with us",
                  url: "https://api.tsed.io/rest/slack/tsedio/tsed"
                },
                {
                  label: "Contribution guide",
                  url: base + "/contributing.html"
                }
              ]
            },
            {
              title: "Support",
              items: [
                {
                  label: "Issues",
                  url: "https://github.com/tsedio/tsed/issues"
                },
                {
                  label: "Sponsoring & donations",
                  url: base + "/support.html"
                }
              ]
            }
          ]
        }
      }
    },
    ...themeConfig
  },
  plugins: {
    "@vuepress/html-redirect": {},
    "@vuepress/google-analytics": {
      ga: "UA-35240348-1"
    },
    "@vuepress/plugin-medium-zoom": {
      selector: "figure img",
      // medium-zoom options here
      // See: https://github.com/francoischalifour/medium-zoom#options
      options: {
        margin: 16
      }
    },
    sitemap: {
      hostname: url
    }
  },
  markdown: {
    lineNumbers: true,
    extendMarkdown: (md) => {
      md.use(markdown);
    }
  }
});
