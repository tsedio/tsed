#!/usr/bin/env node
const path = require("path");
const {init} = require("../src");

init(path.join(__dirname, "../../.."))
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
