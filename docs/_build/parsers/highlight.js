"use strict";

const info = require("../info");
const KEYWORDS = /(\bstatic\b|\bclass\b|\binterface\b|\bprivate\b|\bpublic\b|\bconst\b|\blet\b|\bprotected\b|\bimplements\b|\bconstructor\b|\breadonly\b|\babstract\b|\bimport\b|\bexport\b|\bas\b|\bfrom\b|\extends\b)/g;
const TYPES = /(\bany\b|\bstring\b|\bboolean\b|\bnumber\b|\bDate\b|\bvoid\b)/g;
const SEPARATOR = /(:|;|,|\(|\)|{|}|\[|\])/g;

const replacement = (match, $1, index, content) => {
  if (info.symbols.has($1)) {
    const symbol = info.symbols.get($1);
    const link = symbol.module.docPath + "/" + symbol.symbolName.toLowerCase();

    return "<a href=\"#api/" + link + "\"><span class=\"token\">" + $1 + "</span></a>";
  }

  return match;
};

const symbolsMatch = (current) => {

  const keys = [];

  info.symbols.forEach(o => {
    if (current !== o.symbolName && o.symbolType !== "function") {
      keys.push(o.symbolName);
    }
  });

  return new RegExp("(\\b" + keys.join("\\b|\\b") + "\\b)", "g");
};

module.exports = (content, current) => {

  content = content
    .replace(KEYWORDS, "<span class=\"token keyword\">$1</span>")
    .replace(/(\w+)\(/g, `<span class="token function">$1</span>(`)
    .replace(TYPES, "<span class=\"token keyword\">$1</span>")
    .replace(SEPARATOR, "<span class=\"token punctuation\">$1</span>");

  content = content.replace(symbolsMatch(current), replacement);


  return content;
};

module.exports.bindSymbols = (content, current) => content.replace(symbolsMatch(current), replacement);