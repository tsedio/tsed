/**
 *
 * @param symbol
 * @private
 */
"use strict";

const glob = require("glob");
const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const {Parser} = require("./parsers/parser.js");
const {$log} = require("ts-log-debug");
const info = require("./info");
const DocComponent = require("./models/component.js").DocComponent;

module.exports = (pattern) => {
  $log.info("Scan folders", pattern);
  let files = glob.sync(pattern);

  return files
    .filter((file) => !file.match(/Express.d.ts/))
    .map(file => new DocComponent(file))
    .map(docComponent => {

      try {
        const parser = new Parser(docComponent).parse();
        docComponent.symbols = parser.symbols;

        fsExtra.mkdirsSync(path.join("../api", docComponent.module.docPath));

        docComponent.symbols.forEach((symbol) => {
          symbol.setComponent(docComponent);
        });

        return docComponent;

      } catch (er) {
        $log.error(er);
      }

    });
};