const title = "Ts.ED - A Node.js and TypeScript Framework on top of Express/Koa.js.";
const description = "A Node.js and TypeScript Framework on top of Express/Koa.js. It provides a lot of decorators and guidelines to write your code.";
const url = "https://tsed.io";
module.exports = {
  title,
  description,
  serviceWorker: false,
  theme: "tsed2",
  head: [
    ["link", { canonical: url }],
    ["link", { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" }],
    ["link", { rel: "icon", href: "/favicon.ico", type: "apple-touch-icon" }],
    ["link", { rel: "icon", href: "/apple-touch-icon.png", type: "image/x-icon", sizes: "180x180" }],
    ["link", { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" }],
    ["link", { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" }],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    ["meta", { property: "og:url", content: url }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: title }],
    ["meta", { property: "og:title", content: title }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:image", content: "https://tsed.io/tsed-og.png" }],
    ["meta", { property: "og:image:width", content: "1024" }],
    ["meta", { property: "og:image:height", content: "1024" }],
    ["meta", { name: "twitter:title", content: title }],
    ["meta", { name: "twitter:description", content: description }],
    ["meta", { name: "twitter:card", content: "summary" }]

    // ["script", {
    //   type: "text/javascript",
    //   src: "https://platform-api.sharethis.com/js/sharethis.js#property=5e294abd381cb7001234a73b&product=inline-share-buttons&cms=website",
    //   async: "async"
    // }]
  ],

  themeConfig: {
    shortTitle: "Ts.ED",
    htmlTitle: "<strong class=\"font-medium\"><span class='text-blue'>Ts</span>.ED</strong>",
    version: require("../../package").version,
    licenseType: "MIT",
    author: "Lenzotti Romain",
    copyrightDates: {
      start: "2016",
      end: new Date().getFullYear()
    },
    repo: "TypedProject/tsed",
    openCollective: "tsed",
    gitterUrl: "https://gitter.im/Tsed-io/community",
    stackoverflowUrl: "https://stackoverflow.com/search?q=tsed",
    sponsorUrl: "https://opencollective.com/tsed",
    editLinks: true,
    docsDir: "docs",
    sidebar: "auto",
    docsBranch: "production",
    api: require("./public/api.json"),
    smoothScroll: true,
    algolia: {
      apiKey: "f8a038207e461aaac0e2fd16403c2b01",
      indexName: "ts_ed"
    },
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
            link: "/getting-started/",
            title: `Getting started | ${title}`
          },
          {
            text: "Configuration",
            link: "/docs/configuration.html",
            title: `Configuration | ${title}`
          },
          {
            text: "Documentation",
            link: "/docs/controllers.html",
            title: `Documentation | ${title}`
          },
          {
            icon: "bx bx-dots-horizontal-rounded text-lg",
            link: "/docs/controllers.html",
            title: `More`,
            items: [
              {
                text: "Plugins",
                link: "/plugins",
                items: [
                  {
                    text: "AJV",
                    link: "/tutorials/ajv.md"
                  },
                  {
                    text: "AWS",
                    link: "/tutorials/aws.md"
                  },
                  {
                    text: "Passport.js",
                    link: "/tutorials/passport.md"
                  },
                  {
                    text: "TypeORM",
                    link: "/tutorials/typeorm.md"
                  },
                  {
                    text: "Mongoose",
                    link: "/tutorials/mongoose.md"
                  },
                  {
                    text: "GraphQL",
                    link: "/tutorials/graphql.md"
                  },
                  {
                    text: "Socket.io",
                    link: "/tutorials/socket-io.md"
                  },
                  {
                    text: "Swagger",
                    link: "/tutorials/swagger.md"
                  }
                ]
              },
              {
                text: "Extra",
                items: [
                  {
                    text: "CLI",
                    link: "http://cli.tsed.io"
                  },
                  {
                    text: "Api reference",
                    link: "/api.html"
                  },
                  {
                    text: "Contributes",
                    link: "/tutorials/contributing.md"
                  },
                  {
                    text: "License",
                    link: "/tutorials/licence.md"
                  }
                ]
              }
            ]
          },
          {
            text: "Versions",
            position: "right",
            items: [
              {
                text: "v4 (obsolete)",
                link: "http://v4.tsed.io"
              },
              {
                text: "v5 (current)",
                link: "http://tsed.io"
              }
            ]
          }
        ],
        sidebar: [
          {
            title: "Introduction",   // required
            path: "/getting-started/",
            collapsable: true // optional, defaults to true
          },
          {
            title: "Getting started",
            children: [
              "/getting-started/start-with-cli",
              "/getting-started/start-from-scratch",
              "/getting-started/create-your-first-controller"
            ]
          },
          {
            title: "Migration",
            collapsable: true,
            children: [
              "/getting-started/migration-from-v5",
              "/getting-started/migrate-from-express"
            ]
          },
          {
            title: "Documentation",
            collapsable: true,
            children: [
              "/docs/configuration",
              "/docs/controllers",
              "/docs/providers",
              "/docs/model",
              "/docs/converters",
              "/docs/middlewares",
              "/docs/pipes",
              "/docs/interceptors",
              "/docs/authentication",
              "/docs/hooks",
              "/docs/exceptions",
              { title: "Context", path: "/docs/request-context" },
              "/docs/platform-api"
            ]
          },
          {
            title: "Advanced",
            collapsable: true,
            children: [
              "/docs/validation",
              { title: "Upload files", path: "/docs/upload-files" },
              { title: "Serve files", path: "/docs/serve-files" },
              { title: "Templating", path: "/docs/templating" },
              "/docs/injection-scopes",
              "/docs/custom-providers",
              "/docs/custom-endpoint-decorators",
              "/docs/testing",
              "/api"
            ]
          },
          {
            title: "Plugins",
            collapsable: true,
            children: [
              "/tutorials/passport",
              "/tutorials/typeorm",
              "/tutorials/mongoose",
              "/tutorials/graphql",
              "/tutorials/socket-io",
              { title: "Seq logger", path: "/tutorials/seq" },
              "/tutorials/swagger",
              "/tutorials/ajv",
              "/tutorials/aws"
            ]
          },
          {
            title: "Extras",
            children: [
              "/tutorials/",
              "/tutorials/throw-http-exceptions",
              "/tutorials/not-found-page",
              "/contributing",
              "/license"
            ]
          }
        ],
        otherTopics: [
          "/tutorials/session",
          "/tutorials/passport",
          "/tutorials/typeorm",
          "/tutorials/mongoose",
          "/tutorials/graphql",
          "/tutorials/socket-io",
          "/tutorials/swagger",
          "/tutorials/ajv",
          "/tutorials/multer",
          "/tutorials/serve-static-files",
          "/tutorials/templating",
          "/tutorials/throw-http-exceptions",
          "/tutorials/not-found-page",
          "/tutorials/aws",
          "/tutorials/seq",
          "/docs/controllers",
          "/docs/providers",
          "/docs/model",
          "/docs/converters",
          "/docs/middlewares",
          "/docs/pipes",
          "/docs/interceptors",
          "/docs/authentication",
          "/docs/hooks",
          "/docs/injection-scopes",
          "/docs/custom-providers",
          "/docs/custom-endpoint-decorators",
          "/docs/testing"
        ]
      }
    },
    plugins: [
      [
        "@vuepress/google-analytics",
        {
          ga: "UA-35240348-1"
        }
      ]
    ]
  },
  markdown: {
    lineNumbers: true,
    extendMarkdown: md => {
      md.use(require("@tsed/markdown-it-symbols"));
    }
  }
};
