"use strict";
const {$log} = require("ts-log-debug");
const info = require("../info");
const {SymbolParser} = require("./symbol-parser");

const {
  stripsComments,
  stripsTags
} = require("../strips");

class Parser {

  constructor(docComponent) {
    this.contents = docComponent.contents;
    this.symbols = new Map();
  }

  /**
   *
   * @param str
   * @returns {string}
   */
  overview(str = "") {
    return stripsTags(stripsComments(str))
      .split("\n")
      .filter(o => !!o.trim())
      .join("\n")
      .trim();
  }

  /**
   *
   */
  parse() {
    this.currentSymbol = undefined;
    this.tabLevel = 0;
    this.currentComment = [];
    this.inComment = 0;
    let content = this.contents.split("/** */");
    content = stripsTags(content[content.length - 1]);

    content
      .split("\n")
      .map((line, index, map) => this.parseLine(line, index, map))
      .join("\n");

    // $log.debug(this.symbols);

    return this;
  }

  /**
   *
   * @param line
   * @param index
   * @param map
   */
  parseLine(line, index, map) {

    if (line.trim() === "") {
      return;
    }

    if (line.trim().match(/export \* from/)) {
      return;
    }

    if (line.trim() === "/**") {
      if (this.inComment === 0) {
        this.currentComment = [];
      }
      this.inComment++;
      return;
    }

    if (line.trim() === "*/") {
      this.inComment--;
      return;
    }

    if (this.inComment > 0) {
      this.currentComment.push(line.trim().replace(/^\* |^\*/, ""));
      return;
    }

    if (line.indexOf("}") > -1) {
      this.tabLevel--;
    }

    if (line.match(/}$/)) {
      if (this.tabLevel === 0) {
        if (this.currentSymbol) {
          this.currentSymbol.overview.push(line);
          this.currentSymbol.overview = this.currentSymbol.overview.join("\n");
          this.setSymbol(this.currentSymbol);
          this.currentSymbol = undefined;
        }
      }
    }

    if (this.tabLevel >= 1 && this.currentSymbol) {
      this.currentSymbol.appendMember(this.tabLevel, line, this.currentComment.join("\n"));
      this.currentComment = [];
      this.currentSymbol.overview.push(line.replace(/^export /, ""));
    }

    if (this.tabLevel === 0) {
      if (line.match(/{$/)) {
        if (line.indexOf("function") === -1) {
          const symbolParser = new SymbolParser(line, this.currentComment.join("\n"), this.contents);
          symbolParser.parse();
          this.currentComment = [];
          this.currentSymbol = symbolParser.symbol;
          this.currentSymbol.overview = [line.replace(/^export /, "")];
        }
      }
    }


    if (line.indexOf("{") > -1) {
      this.tabLevel++;
    }

    if (line.match(/^export /) && this.currentSymbol === undefined) {

      if (line.match(/;$/)) {
        const symbolParser = new SymbolParser(line, this.currentComment.join("\n"), this.contents);
        symbolParser.parse();
        symbolParser.symbol.overview = line.replace(/^export /, "");
        this.setSymbol(symbolParser.symbol);
        return;
      }

      const nextContent = map.slice(index, map.length);
      let otherExportFound = -1;
      const overview = nextContent.filter((l) => {
        if (l.match(/^export /)) {
          otherExportFound++;
        }
        return otherExportFound <= 0;
      });
      const symbolParser = new SymbolParser(line, this.currentComment.join("\n"), this.contents);
      symbolParser.parse();
      symbolParser.symbol.overview = overview.join("\n").replace(/^export /, "");
      this.setSymbol(symbolParser.symbol);
      return;
    }

    return line;
  }

  setSymbol(symbol) {

    if (info.symbols.has(symbol.symbolName)) {
      info.symbols.get(symbol.symbolName).merge(symbol);
    } else {
      this.symbols.set(symbol.symbolName, symbol);
      info.symbols.set(symbol.symbolName, symbol);
    }
  }
}

module.exports.Parser = Parser;