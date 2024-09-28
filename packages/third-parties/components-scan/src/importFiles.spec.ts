import {join} from "path";

import {Test1} from "./__mock__/Test1.js";
import {Test2} from "./__mock__/Test2.js";
import {importFiles} from "./importFiles.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

describe("importFiles", () => {
  it("should import symbols", async () => {
    const symbols = await importFiles([join(rootDir, "__mock__/*.ts")], []);

    expect(symbols.sort()).toEqual(["value", Test1, "value", Test2].sort());
  });

  it("should import symbols without excluded files", async () => {
    const symbols = await importFiles([join(rootDir, "__mock__/*.ts")], [join(rootDir, "__mock__/Test2.ts")]);

    expect(symbols.sort()).toEqual(["value", Test1].sort());
  });
});
