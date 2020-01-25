const title = "Ts.ED - A Node.js and TypeScript Framework on top of Express.";
const description = "A Node.js and TypeScript Framework on top of Express. It provides a lot of decorators and guidelines to write your code.";
const url = "https://tsed.io";
module.exports = {
  title,
  description,
  serviceWorker: false,
  theme: "tsed",
  head: [
    ["link", {canonical: url}],
    ["link", {rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon"}],
    ["link", {rel: "icon", href: "/favicon.ico", type: "image/x-icon"}],
    ["meta", {property: "og:url", content: url}],
    ["meta", {property: "og:type", content: "website"}],
    ["meta", {property: "og:site_name", content: title}],
    ["meta", {property: "og:title", content: title}],
    ["meta", {property: "og:description", content: description}],
    // ["meta", {property: "og:image", content: "https://nestjs.com/img/nest-og.png"}],
    // ["meta", {property: "og:image:width", content: "1200"}],
    // ["meta", {property: "og:image:height", content: "650"}],
    ["meta", {name: "twitter:title", content: title}],
    ["meta", {name: "twitter:description", content: description}],
    ["meta", {name: "twitter:card", content: "summary"}]
    // ["script", {
    //   type: "text/javascript",
    //   src: "https://platform-api.sharethis.com/js/sharethis.js#property=5e294abd381cb7001234a73b&product=inline-share-buttons&cms=website",
    //   async: "async"
    // }]
  ],

  themeConfig: {
    shortTitle: "Ts.ED",
    version: require("../../package").version,
    repo: "TypedProject/tsed",
    openCollective: "tsed",
    gitterUrl: "https://gitter.im/Tsed-io/community",
    stackoverflowUrl: "https://stackoverflow.com/questions/tagged/tsed",
    sponsorUrl: "https://opencollective.com/tsed",
    editLinks: true,
    docsDir: "docs",
    sidebar: "auto",
    api: require("./public/api.json"),
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
            link: "/getting-started.html",
            title: `Getting started | ${title}`
          },
          {
            text: "Configuration",
            link: "/configuration.html",
            title: `Configuration | ${title}`
          },
          {
            text: "Docs",
            title: `Documentation | ${title}`,
            items: [
              {
                text: "Overview",
                items: [
                  {link: "/docs/controllers.html", text: "Controllers", items: []},
                  {link: "/docs/providers.html", text: "Providers"},
                  {link: "/docs/model.html", text: "Models"},
                  {link: "/docs/converters.html", text: "Converters"},
                  {link: "/docs/middlewares.html", text: "Middlewares"},
                  {link: "/docs/filters.html", text: "Filters"},
                  {link: "/docs/interceptors.html", text: "Interceptors"},
                  {link: "/docs/authentication.html", text: "Authentication"},
                  {link: "/docs/hooks.html", text: "Hooks"}
                ]
              },
              {
                text: "Advanced",
                items: [
                  {link: "/docs/request-data-persistence.html", text: "Request data persistence"},
                  {link: "/docs/injection-scopes.html", text: "Injection scopes"},
                  {link: "/docs/custom-providers.html", text: "Custom providers"},
                  {link: "/docs/custom-endpoint-decorators.html", text: "Custom endpoint decorators"},
                  {link: "/docs/testing.html", text: "Testing"},
                  {link: "/api.html", text: "Api Reference"}
                ]
              }
            ]
          },
          {
            text: "Guide",
            type: "links",
            title: `Guide | ${title}`,
            items: [
              {link: "/tutorials/", text: "Examples"},
              {link: "/tutorials/session.html", text: "Session & cookies"},
              {link: "/tutorials/passport.html", text: "Passport.js"},
              {link: "/tutorials/typeorm.html", text: "TypeORM"},
              {link: "/tutorials/mongoose.html", text: "Mongoose"},
              {link: "/tutorials/graphql.html", text: "GraphQL"},
              {link: "/tutorials/seq.html", text: "Seq"},
              {link: "/tutorials/socket-io.html", text: "Socket.io"},
              {link: "/tutorials/swagger.html", text: "Swagger"},
              {link: "/tutorials/ajv.html", text: "Validation with AJV"},
              {link: "/tutorials/multer.html", text: "Upload files"},
              {link: "/tutorials/serve-static-files.html", text: "Serve static files"},
              {link: "/tutorials/templating.html", text: "Templating"},
              {link: "/tutorials/throw-http-exceptions.html", text: "Throw HTTP exceptions"},
              {link: "/tutorials/not-found-page.html", text: "Customize 404"},
              {link: "/tutorials/aws.html", text: "AWS project"},
              {link: "/tutorials/jest.html", text: "Jest"}
            ]
          },
          {
            text: "4.x",
            link: "http://v4.tsed.io"
          }
        ],
        sidebar: {
          "/docs/middlewares/": [{
            title: "Middlewares",
            collapsable: false,
            children: [
              "call-sequence",
              "override-middleware",
              "override/authentication",
              "override/global-error-handler",
              "override/response-view",
              "override/send-response"
            ]
          }],
          "/docs/": [
            {
              title: "Overview",
              collapsable: false,
              children: [
                "controllers",
                "providers",
                "model",
                "converters",
                "middlewares",
                "filters",
                "interceptors",
                "authentication",
                "request-data-persistence",
                "hooks"
              ]
            },
            {
              title: "Advanced",
              collapsable: false,
              children: [
                "injection-scopes",
                "custom-providers",
                "custom-endpoint-decorators",
                "testing"
              ]
            }
          ],
          "/tutorials/": [{
            title: "Guide",
            collapsable: false,
            children: [
              "",
              "session",
              "passport",
              "typeorm",
              "mongoose",
              "graphql",
              "socket-io",
              "seq",
              "swagger",
              "ajv",
              "custom-validator",
              "multer",
              "serve-static-files",
              "templating",
              "throw-http-exceptions",
              "not-found-page",
              "aws",
              "jest"
            ]
          }]
        },

        otherTopics: [
          "/tutorials/session",
          "/tutorials/passport",
          "/tutorials/typeorm",
          "/tutorials/mongoose",
          "/tutorials/graphql",
          "/tutorials/socket-io",
          "/tutorials/swagger",
          "/tutorials/ajv",
          "/tutorials/custom-validator",
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
          "/docs/filters",
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
