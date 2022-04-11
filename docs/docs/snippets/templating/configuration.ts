import {Configuration} from "@tsed/di";

@Configuration({
  views: {
    root: `../views`,
    viewEngine: "ejs",
    extensions: {
      // optional
      ejs: "ejs",
      hbs: "handlebars"
    },
    options: {
      ejs: {} // global options for ejs engine. See official engine documentation for more details.
    }
  }
})
class Server {}
