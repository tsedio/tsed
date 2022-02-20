import {join} from "path";
import {importFiles} from "./importFiles";
import {Test1} from "./__mock__/Test1";
import {Test2} from "./__mock__/Test2";

describe("importFiles", () => {
  it("should import symbols", async () => {
    const symbols = await importFiles([join(__dirname, "__mock__/*.ts")], []);

    expect(symbols).toEqual(["value", Test1, "value", Test2]);
  });

  it("should import symbols without excluded files", async () => {
    const symbols = await importFiles([join(__dirname, "__mock__/*.ts")], [join(__dirname, "__mock__/Test2.ts")]);

    expect(symbols).toEqual(["value", Test1]);
  });
});
