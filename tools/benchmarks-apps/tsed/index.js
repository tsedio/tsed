"use strict";
const {printMemory} = require("../printMemory");
const {PlatformExpress} = require("@tsed/platform-express");
const {Server} = require("./app/server");

PlatformExpress.bootstrap(Server, {
  port: process.env.PORT || 3001
})
  .then((platform) => platform.listen())
  .then(() => {
    printMemory();
  });
