"use strict";
const path = require("path");
const fsExtra = require("fs-extra");
const {$log} = require("ts-log-debug");
const info = require("./info");

const toHTML = (symbol) => {
  const {module, symbolName, symbolType} = symbol;

  const deprecated = symbol.hasLabel("deprecated");
  const classList = `symbol-container ${deprecated ? "" : "deprecated"} symbol-type-${symbolType} symbol-name-${module.docPath.replace("/", "")}-${symbolName}`;

  return `<a href="#/api/${module.docPath}/${symbolName.toLowerCase()}" class="${classList}" title="${symbolName}">
            <span class="symbol ${symbolType}"></span>
            ${deprecated ? "<del>" : ""}${symbolName}${deprecated ? "</del>" : ""}
        </a>
        `.trim().replace(/\n/g, "");
};

const typesField = () => {
  const list = {};
  Object.keys(info.symbolTypes)
    .filter(key => key.length === 1)
    .sort()
    .forEach((k) => {
      list[k] = info.symbolTypes[k];
    });
  return buildDropdown("Type", list);
};

const statusField = () => {
  return buildDropdown("Status", info.status);
};

const buildDropdown = (label, list) => {

  let elements = Object
    .keys(list)
    .map((key) => {
      return `
        <li role="button" tabindex="0" data-value="${list[key].value}" data-label="${list[key].label}">
            <span class="symbol ${list[key].value}"></span>${list[key].label}
        </li>`;
    }).join("\n");

  return `
    <aio-select class="aio-${label.toLowerCase()}" label="${label}:">
        <div class="form-select-menu">
        <button class="form-select-button">
          <strong>${label}:</strong><span class="symbol all"></span><span class="symbol-text">All</span>
        </button>
        <ul class="form-select-dropdown">
          <li role="button" tabindex="0" class="selected" data-type="">
            <span class="symbol all"></span>All
          </li>
          ${elements}
        </ul>
        </div>
    </aio-select>
    `.replace(/\t|\n/gi, "");
};

const searchField = () => {
  return `
    <div class="form-search api-search">
        <input placeholder="Filter">
        <i class="material-icons">search</i>
    </div>
    `.replace(/\t|\n/gi, "");
};

const mapInfo = (symbol) => {
  return [
    symbol.module.docPath,
    symbol.symbolName,
    symbol.symbolType,
    symbol.symbolCode,
    symbol.hasLabel("deprecated"),
    symbol.hasLabel("stable"),
    symbol.hasLabel("experimental"),
    symbol.hasLabel("private")
  ].join(";");
};

module.exports.writeIndex = () => {
  const indexTemplate = [
    "# Api",
    "",
    "<div class=\"plugin-api-search\"><div class=\"plugin-api-search-nav\">",
    typesField() + statusField() + searchField(),
    "</div>",
    ""
  ];

  Object.keys(info.modules).map(key => {
    const module = info.modules[key];
    indexTemplate.push("\n#### " + module + "\n\n");
    const symbols = [];

    info.symbols.forEach(symbol => {
      if (symbol.module.docPath === module) {
        symbols.push(symbol.symbolName);
      }
    });

    const list = symbols
      .sort()
      .map(symbolName => "<li class=\"api-item\" data-symbol=\"" + mapInfo(info.symbols.get(symbolName)) + "\">" + toHTML(info.symbols.get(symbolName)) + "</li>")
      .join("\n");

    indexTemplate.push("<ul class=\"api-list\">" + list + "</ul>");
  });

  indexTemplate.push("</div>");

  fsExtra.writeFile(path.join("../api", "index.md"), indexTemplate.join("\n") + "\n\n", {
    encoding: "utf8",
    flag: "w"
  });
};

module.exports.writeSymbol = (symbol) => {

  if (symbol.symbolName.trim() === "") {
    console.error("Symbol empty =>", symbol);
    return;
  }

  $log.info("Write", path.join(symbol.module.docPath, symbol.symbolName.toLowerCase() + ".md"));

  fsExtra.writeFile(path.join("../api", symbol.module.docPath, symbol.symbolName.toLowerCase() + ".md"), symbol.output, {
    encoding: "utf8",
    flag: "w"
  });
};
