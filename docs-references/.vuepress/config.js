const settings = require("./config.base");

const conf = settings({
  title: "Ts.ED API - A Node.js and TypeScript Framework on top of Express/Koa.js.",
  description: "A Node.js and TypeScript Framework on top of Express/Koa.js. It provides a lot of decorators and guidelines to write your code.",
  url: "https://api-docs.tsed.io",
  base: "https://tsed.io",
  apiRedirectUrl: "",
  themeConfig: {
    shortTitle: "Ts.ED API",
    htmlTitle: "<strong class=\"font-medium\"><span class='text-blue'>Ts</span>.ED API</strong>",
    algolia: false
  }
})

conf.themeConfig.locales["/"].otherTopics = []

module.exports = conf;
