const {$log} = require("ts-log-debug");
const DocSymbol = require("../models/symbol.js").DocSymbol;
const {descriptionParser} = require("./description-parser");
const info = require("../info");

class SymbolParser {
  constructor(line, description, contents) {
    this.line = line;
    this.contents = contents;

    description = descriptionParser(description);

    this.description = description;
    this.symbol = new DocSymbol(line, contents);
    this.symbol.description = description.content;
    this.symbol.labels = this.symbol.labels.concat(description.labels);

  }

  parse() {
    try {
      if (this.line.match(/class |interface |enum /)) {
        this.parseClass();
      } else {
        this.parseOtherSymbol();
      }
    } catch (er) {

      console.error(this.line, er);
    }


    return this.symbol;
  }

  /**
   *
   */
  parseClass() {
    let line = this.line
      .split(" ")
      .filter((word, index, map) => this.parseKeyword(word, index, map)).join(" ");

    this.symbol.implements = line
      .replace("implements ", "")
      .replace("{", "")
      .trim()
      .split(" ")
      .filter(o => o !== "")
      .filter(o => !o.match(">"))
      .filter(o => !o.match(">"))
      .map(o => o.split("<")[0])
      .filter(o => o !== this.symbol.symbolName);
  }

  /**
   *
   */
  parseOtherSymbol() {
    this.line = this.line.replace(/^export /, "");
    this.symbol.exported = true;

    const isFunction = this.line.match(/^function (\w+)\(|^const (\w+): \(/);
    const matched = this.line.match(/^(\w+) (\w+)/);

    if (matched) {
      if (isFunction) {
        this.symbol.symbolType = "function";
      } else {
        this.symbol.symbolType = matched[1];
      }

      this.symbol.symbolName = matched[2];

      this.symbol.symbolLabel = info.symbolTypes[this.symbol.symbolType].label;
      this.symbol.symbolCode = info.symbolTypes[this.symbol.symbolType].code;
    }

  }

  /**
   *
   * @param word
   * @param index
   * @param map
   * @returns {boolean}
   */
  parseKeyword(word, index, map) {
    if (word.match(/,<>/)) {
      return true;
    }

    if (word === "export") {
      this.symbol.exported = true;
      return false;
    }

    if (word === "abstract") {
      this.symbol.abstract = true;
      return false;
    }
    if (word.match(/class$|interface$|enum$/)) {
      this.symbol.symbolType = word;
      this.symbol.symbolCode = info.symbolTypes[word].code;
      this.symbol.symbolLabel = info.symbolTypes[word].label;
      this.symbol.symbolName = map[index + 1].split("<")[0];
      return false;
    }

    if (word === "extends") {
      this.symbol.extends = map[index + 1];
      return false;
    }
    return !(word === this.symbol.symbolName || word === this.symbol.extends);
  }
}

module.exports.SymbolParser = SymbolParser;