import {cleanGlobPatterns} from "./cleanGlobPatterns.js";
import {isTsEnv} from "./isTsEnv.js";

vi.mock("./isTsEnv");

describe("cleanGlobPatterns()", () => {
  describe("when haven't typescript compiler", () => {
    beforeAll(() => {
      (isTsEnv as any).mockReturnValue(false);
    });

    it("should return file.js", () => {
      expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).toContain("file.js");
    });

    it("should return file.ts,js", () => {
      expect(cleanGlobPatterns("file{.ts,.js}", ["!**.spec.ts"])[0]).toContain("file.js");
    });

    it("should return file.ts.js and manipulate only the file extension", () => {
      expect(cleanGlobPatterns("file.ts.ts", ["!**.spec.ts"])[0]).toContain("file.ts.js");
    });
  });
  describe("when have typescript compiler", () => {
    beforeAll(() => {
      (isTsEnv as any).mockReturnValue(true);
    });
    it("should return file.ts", () => {
      expect(cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).toContain("file.ts");
    });
  });
});
