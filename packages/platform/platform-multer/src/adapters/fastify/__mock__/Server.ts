import "@tsed/ajv";
import "@tsed/platform-log-request";
import "@tsed/swagger";
import "@tsed/platform-fastify";

import {Configuration} from "@tsed/di";

export const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

@Configuration({
  port: 8083,
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
