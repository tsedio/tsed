"use strict";
const {PlatformKoa} = require("@tsed/platform-koa");
const {Server} = require("../tsed/app/server");

PlatformKoa.bootstrap(Server, {
  port: process.env.PORT || 3000
}).then((platform) => platform.listen());
