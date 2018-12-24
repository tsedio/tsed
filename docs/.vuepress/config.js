module.exports = {
  title: "Ts.ED",
  description: "A TypeScript Framework on top of Express",
  serviceWorker: false,
  theme: "tsed",
  themeConfig: {
    version: require("../../package").version,
    repo: "romakita/ts-express-decorators",
    editLinks: true,
    docsDir: "docs",
    sidebar: "auto",
    ga: "UA-35240348-1",
    apiUrl: "/api.json",

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
            link: "/getting-started.html"
          },
          {
            text: "Configuration",
            link: "/configuration.html"
          },
          {
            text: "Guide",
            type: "links",
            items: [
              {link: "/tutorials/", text: "Examples"},
              {link: "/tutorials/authentication.html", text: "Authentication"},
              {link: "/tutorials/session.html", text: "Session & cookies"},
              {link: "/tutorials/passport.html", text: "Passport.js"},
              {link: "/tutorials/typeorm.html", text: "TypeORM"},
              {link: "/tutorials/mongoose.html", text: "Mongoose"},
              {link: "/tutorials/socket-io.html", text: "Socket.io"},
              {link: "/tutorials/swagger.html", text: "Swagger"},
              {link: "/tutorials/ajv.html", text: "Validation with AJV"},
              {link: "/tutorials/upload-files-with-multer.html", text: "Upload files"},
              {link: "/tutorials/serve-static-files.html", text: "Serve static files"},
              {link: "/tutorials/templating.html", text: "Templating"},
              {link: "/tutorials/throw-http-exceptions.html", text: "Throw HTTP exceptions"},
              {link: "/tutorials/not-found-page.html", text: "Customize 404"},
              {link: "/tutorials/aws.html", text: "AWS project"}
            ]
          },
          {
            text: "Documentation",
            items: [
              {link: "/docs/controllers.html", text: "Controllers"},
              {link: "/docs/services.html", text: "Services"},
              {link: "/docs/factory.html", text: "Factory"},
              {link: "/docs/provider.html", text: "Provider"},
              {link: "/docs/model.html", text: "Models"},
              {link: "/docs/converters.html", text: "Converters"},
              {link: "/docs/middlewares.html", text: "Middlewares"},
              {link: "/docs/scope.html", text: "Scope"},
              {link: "/docs/filters.html", text: "Filters"},
              {link: "/docs/interceptors.html", text: "Interceptors"},
              {link: "/docs/server-loader.html", text: "ServerLoader"},
              {link: "/docs/testing.html", text: "Testing"}
            ]
          },
          {
            text: "Api Reference",
            link: "/api.html"
          },
          {
            text: "Gitter",
            link: "https://gitter.im/Tsed-io/community"
          }
        ],

        sidebar: {
          "/docs/middlewares/": [{
            title: "Middlewares",
            collapsable: false,
            children: [
              "global-middleware",
              "global-error-middleware",
              "endpoint-middleware",
              "endpoint-error-middleware",
              "call-sequence",
              "override-middleware",
              "override/authentication",
              "override/global-error-handler",
              "override/response-view",
              "override/send-response"
            ]
          }],

          "/docs/": [{
            title: "Documentation",
            collapsable: false,
            children: [
              "controllers",
              "services",
              "factory",
              "provider",
              "model",
              "converters",
              "middlewares",
              "scope",
              "filters",
              "interceptors",
              "server-loader",
              "testing"
            ]
          }],


          "/tutorials/": [{
            title: "Guide",
            collapsable: false,
            children: [
              "",
              "authentication",
              "session",
              "passport",
              "typeorm",
              "mongoose",
              "socket-io",
              "swagger",
              "ajv",
              "custom-validator",
              "multer",
              "serve-static-files",
              "templating",
              "throw-http-exceptions",
              "not-found-page",
              "aws"
            ]
          }]
        },

        otherTopics: [
          "/tutorials/authentication",
          "/tutorials/session",
          "/tutorials/passport",
          "/tutorials/typeorm",
          "/tutorials/mongoose",
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
          "/docs/controllers",
          "/docs/services",
          "/docs/factory",
          "/docs/provider",
          "/docs/model",
          "/docs/converters",
          "/docs/middlewares",
          "/docs/scope",
          "/docs/filters",
          "/docs/interceptors",
          "/docs/server-loader",
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
    }
  }
};
