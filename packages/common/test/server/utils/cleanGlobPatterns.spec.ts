import {expect} from "chai";
import {cleanGlobPatterns} from "../../../src/server/utils/cleanGlobPatterns";

describe("cleanGlobPatterns()", () => {
  before(() => {
    this.compilerBackup = require.extensions[".ts"];
  });
  after(() => {
    require.extensions[".ts"] = this.compilerBackup;
  });
  describe("when haven't typescript compiler", () => {
    before(() => {
      this.compiler = require.extensions[".ts"];
      delete require.extensions[".ts"];
    });
    after(() => {
      require.extensions[".ts"] = this.compiler;
    });
    it("should return file.js", () => {
      expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.js");
    });

    it("should return file.ts.js and manipulate only the file extension", () => {
      expect(cleanGlobPatterns("file.ts.ts", ["!**.spec.ts"])[0]).to.contains("file.ts.js");
    });
  });
  describe("when have typescript compiler", () => {
    before(() => {
      this.compiler = require.extensions[".ts"];
      require.extensions[".ts"] = () => {
      };
    });
    after(() => {
      delete require.extensions[".ts"];
      require.extensions[".ts"] = this.compiler;
    });
    it("should return file.ts", () => {
      expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.ts");
    });
  });
});
