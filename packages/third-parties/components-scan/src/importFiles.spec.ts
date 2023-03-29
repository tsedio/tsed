import filedirname from "filedirname";
import {join} from "path";
import {importFiles} from "./importFiles";
import {Test1} from "./__mock__/Test1";
import {Test2} from "./__mock__/Test2";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

describe("importFiles", () => {
  it("should import symbols", async () => {
    const symbols = await importFiles([join(rootDir, "__mock__/*.ts")], []);

    expect(symbols).toEqual(["value", Test1, "value", Test2]);
  });

  it("should import symbols without excluded files", async () => {
    const symbols = await importFiles([join(rootDir, "__mock__/*.ts")], [join(rootDir, "__mock__/Test2.ts")]);

    expect(symbols).toEqual(["value", Test1]);
  });
});
