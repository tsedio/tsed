const title = "Ts.ED - A Node.js and TypeScript Framework on top of Express/Koa.js.";
const description = "A Node.js and TypeScript Framework on top of Express/Koa.js. It provides a lot of decorators and guidelines to write your code.";
const url = "https://tsed.io";
module.exports = {
  title,
  description,
  serviceWorker: false,
  theme: "tsed",
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
    shortTitle: "Ts.ED v6",
    version: require("../../package").version,
    repo: "TypedProject/tsed",
    openCollective: "tsed",
    gitterUrl: "https://gitter.im/Tsed-io/community",
    stackoverflowUrl: "https://stackoverflow.com/search?q=tsed",
    sponsorUrl: "https://opencollective.com/tsed",
    editLinks: true,
    docsDir: "docs",
    sidebar: "auto",
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
            text: "Versions",
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
              "/getting-started/migrate-from-express",
              "/getting-started/migrate-from-koa"
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
              "/tutorials/ajv"
            ]
          },
          {
            title: "Extras",
            children: [
              "/tutorials/",
              "/tutorials/aws",
              "/tutorials/throw-http-exceptions",
              "/tutorials/not-found-page",

              "/contributing",
              "/license"
            ]
          }
        ],
        //
        // {
        // "/": [
        //   {
        //     title: "Getting started",
        //     collapsable: true,
        //     children: [
        //       "getting-started",
        //       "start-application-from-scratch",
        //       "create-your-first-controller"
        //     ]
        //   },
        //   {
        //     title: "Migration",
        //     collapsable: true,
        //     children: [
        //       "migration-from-v5",
        //       "migrate-from-express",
        //       "migrate-from-koa"
        //     ]
        //   },
        //   {
        //     title: "Documentation",
        //     collapsable: true,
        //     children: [
        //       "configuration",
        //       "controllers",
        //       "providers",
        //       "model",
        //       "converters",
        //       "middlewares",
        //       "pipes",
        //       "interceptors",
        //       "authentication",
        //       "hooks",
        //       "exceptions",
        //       "platform-api"
        //     ]
        //   },
        //
        //   {
        //     title: "Plugins",
        //     collapsable: false,
        //     children: [
        //       "passport",
        //       "typeorm",
        //       "mongoose",
        //       "graphql",
        //       "socket-io",
        //       "seq",
        //       "swagger",
        //       "ajv",
        //       "multer"
        //     ]
        //   },
        //   {
        //     title: "Extras",
        //     collapsable: true,
        //     children: [
        //       "",
        //       "throw-http-exceptions",
        //       "aws"
        //     ]
        //   }
        // ]
        // },
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
          "/tutorials/jest",
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
        ],

        footer: {
          lastUpdated: "Last update",
          caughtMistake: "Caught a mistake or want to contribute to the documentation?",
          editPageOnGithub: "Edit on Github",
          contribute: "Contribute",
          helpToContribute: "Help shape the future of Ts.Ed by joining our team and send us pull requests via our",
          githubRepository: "GitHub repository!",
          license: "License",
          releaseUnder: "Released under the",
          documentationGeneratedWith: "Documentation generated with"
        }
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
      md.use(require("vuepress-theme-tsed/plugins/markdown-it-symbol"));
    }
  }
};
