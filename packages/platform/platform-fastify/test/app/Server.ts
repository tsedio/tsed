import "@tsed/ajv";
import "@tsed/platform-log-request";
import "@tsed/swagger";

import path from "node:path";

import type {FastifySessionOptions} from "@fastify/session";
import {Configuration} from "@tsed/di";

export const rootDir = import.meta.dirname;

@Configuration({
  port: 8083,
  statics: {
    "/": path.join(rootDir, "public")
  },
  views: {
    root: path.join(rootDir, "views"),
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
      use: "@fastify/session",
      options: {
        secret: "a secret with minimum length of 32 characters",
        saveUninitialized: true,
        cookie: {secure: false}
      } satisfies FastifySessionOptions
    },
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
