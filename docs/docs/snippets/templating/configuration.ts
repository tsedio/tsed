import {Configuration} from "@tsed/common";

const rootDir = __dirname;

@Configuration({
  rootDir,
  viewsDir: `${rootDir}/views`,
  views: {
    root: `${rootDir}/views`,
    viewEngine: "ejs",
    extensions: { // optional
      "ejs": "ejs",
      "hbs": "handlebars"
    },
    options: {
      ejs: {} // global options for ejs engine. See official engine documentation for more details.
    }
  }
})
class Server {
}
