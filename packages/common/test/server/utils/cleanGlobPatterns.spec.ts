import {expect} from "chai";
import {cleanGlobPatterns} from "../../../src/server/utils/cleanGlobPatterns";

describe("cleanGlobPatterns()", () => {
  let compilerBackup: any;
  before(() => {
    compilerBackup = require.extensions[".ts"];
  });
  after(() => {
    require.extensions[".ts"] = compilerBackup;
  });
  describe("when haven't typescript compiler", () => {
    let compiler: any;
    before(() => {
      compiler = require.extensions[".ts"];
      delete require.extensions[".ts"];
    });
    after(() => {
      require.extensions[".ts"] = compiler;
    });
    it("should return file.js", () => {
      expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.js");
    });

    it("should return file.ts.js and manipulate only the file extension", () => {
      expect(cleanGlobPatterns("file.ts.ts", ["!**.spec.ts"])[0]).to.contains("file.ts.js");
    });

    describe("when using ts-jest", () => {
      it("should return file.ts", () => {
        process.env["TS_TEST"] = "true";
        expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.ts");
        delete process.env["TS_TEST"];
      });

      it("should return file.js", () => {
        expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.js");
      });
    });
  });
  describe("when have typescript compiler", () => {
    let compiler: any;
    before(() => {
      compiler = require.extensions[".ts"];
      require.extensions[".ts"] = () => {
      };
    });
    after(() => {
      delete require.extensions[".ts"];
      require.extensions[".ts"] = compiler;
    });
    it("should return file.ts", () => {
      expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.ts");
    });
  });
});
