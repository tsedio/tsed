const info = require("../info");
const descriptionParser = require("../parsers/description-parser.js").descriptionParser;

const _filterParams = (labels) => {

  return labels.filter(o => o.key === "param")
    .map(o => {
      const spaceIndex = o.value.trim().indexOf(" ");
      if (spaceIndex === -1) {
        return;
      }
      const paramKey = o.value.slice(0, spaceIndex);
      const description = o.value.slice(spaceIndex + 1, o.value.length);
      return {
        paramKey,
        description
      };
    })
    .filter(o => !!o);
};

class DocSymbol {

  constructor() {
    this.symbolName = "";
    this.module = "";
    this.github = "";
    this.url = "";
    this.abstract = false;
    this.symbolType = "";
    this.symbolLabel = "";
    this.symbolCode = "";
    this.extends = "";
    this.implements = [];
    this.members = [];
    this.description = "";
    this.exported = false;
    this.labels = [];
  }

  /**
   *
   * @param tabLevel
   * @param line
   * @param description
   */
  appendMember(tabLevel, line, description) {

    if (tabLevel > 1) {
      this.members[this.members.length - 1].overview.push(line.replace("   ", ""));
      return;
    }

    if (line.indexOf("}") > -1) {
      this.members[this.members.length - 1].overview.push(line.replace("   ", ""));
      return;
    }

    description = descriptionParser(description);

    this.members.push({
      description: description.content,
      labels: description.labels,
      overview: [line.trim().replace(";", "")]
    });

  }

  getMembers() {
    return this.members.map(member => {
      member.params = _filterParams(member.labels);
      member.overview = member.overview.join("\n");
      return member;
    });
  }

  setComponent(docComponent) {
    this.file = docComponent.file;
    this.path = docComponent.path;
    this.srcPath = docComponent.srcPath;
    this.module = docComponent.module;
    this.url = `${info.host}${docComponent.path}#L${0}-L${0}`;

    if (this.path.match("decorators")) {
      this.symbolType = "decorator";
      this.symbolLabel = info.symbolTypes["decorator"].label;
      this.symbolCode = info.symbolTypes["decorator"].code;
    }

    if (this.path.match("services")) {
      this.symbolType = "service";
      this.symbolLabel = info.symbolTypes["service"].label;
      this.symbolCode = info.symbolTypes["service"].code;
    }
    this.isPrivate();
  }

  isPrivate() {
    if (this.private === undefined) {
      if (this.symbolType !== "interface") {

        const modulePath = this.module.name.replace("ts-express-decorators", "../../lib/");
        const path = require("path").resolve(modulePath);
        const exported = require(path + "/index.js");
        const symbolPrivate = exported[this.symbolName.trim()];

        this.private = !symbolPrivate;
        if (this.private) {
          this.labels.push({key: "private", value: "private"});
        }
      }
    }

    return this.private;
  }

  hasLabel(key) {
    return !!this.labels.find(label => label.key === key);
  }


  merge(symbol) {
    if (symbol.symbolType !== "const") {
      this.symbolType = symbol.symbolType;
      this.symbolCode = symbol.symbolCode;
      this.symbolLabel = symbol.symbolLabel;
    }

    if (this.description === "") {
      this.description = symbol.description;
      this.labels = symbol.labels;
    }

    if (this.overview !== symbol.overview) {
      this.overview = this.overview + "\n" + symbol.overview;
    }
  }

  modulePath() {
    const isPrivate = this.isPrivate();

    if (!isPrivate) {
      return this.module.name;
    }

    return this.srcPath.replace(info.root + "/src", "ts-express-decorators/lib").replace(/\.ts$/, "");
  }

  getParams() {
    return _filterParams(this.labels);
  }
}

module.exports.DocSymbol = DocSymbol;