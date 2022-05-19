import "@tsed/ajv";
import {Configuration} from "@tsed/di";

export const rootDir = __dirname;

@Configuration({
  port: 8083,
  statics: {
    "/": `${rootDir}/public`
  },
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  logger: {
    level: "info"
  },
  plugins: [
    "@fastify/accepts",
    "@fastify/cookie",
    {
      use: "fastify-raw-body",
      options: {
        global: false,
        runFirst: true
      }
    },
    "@fastify/formbody"
  ]
})
export class Server {}
