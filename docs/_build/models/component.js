const info = require("../info");
const path = require("path");
const fs = require("fs");
const {$log} = require("ts-log-debug");

class DocComponent {
  /**
   *
   * @param file
   */
  constructor(file) {
    this.file = file;
    this.path = (file || "").replace(path.join(info.root, "lib/"), "").replace(".d.ts", ".ts");
    this.srcPath = path.resolve(path.join(info.root, "src", this.path));

    this.symbol = path.basename(file).replace(".d.ts", "");
    this.module = this.getModule();
    this.symbols = new Map();

    this.originalContents = fs.readFileSync(this.srcPath).toString();
    this.contents = fs.readFileSync(file).toString();

    // $log.debug("DocComponent created from", this.file);
  }

  getModule() {
    const index = this.path.split("/")[0];
    const docPath = info.modules[index] || "common";
    const isCommon = docPath.indexOf("common/") > -1;
    const name = isCommon ? "ts-express-decorators" : ("ts-express-decorators/" + index);
    const srcPath = path.resolve(
      isCommon ? path.join(info.root, "src") : path.join(info.root, "src", index)
    );
    return {
      docPath,
      name,
      srcPath,
      isCommon
    };
  }
}

module.exports.DocComponent = DocComponent;