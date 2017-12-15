const {homepage, version} = require("../../package.json");
const github = homepage.replace("#readme", "");
const path = require("path");
const root = path.resolve(path.join(__dirname, "../../"));

module.exports = {
  root,
  github,
  host: `${github}/blob/v${version}/src/`,
  modules: {
    "core": "common/core",
    "converters": "common/converters",
    "di": "common/di",
    "filters": "common/filters",
    "mvc": "common/mvc",
    "server": "common/server",
    "ajv": "ajv",
    "multipartfiles": "multipartfiles",
    "servestatic": "servestatic",
    "socketio": "socketio",
    "swagger": "swagger",
    "testing": "testing"
  },
  symbolTypes: require("./types"),
  symbols: new Map(),
  status: {
    "S": {value: "stable", label: "Stable"},
    "D": {value: "deprecated", label: "Deprecated"},
    "E": {value: "experimental", label: "Experimental"},
    "P": {value: "private", label: "Private"},
    "O": {value: "public", label: "Public"}
  }
};