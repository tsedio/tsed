import {expect} from "chai";
import {join} from "path";
import {importFiles} from "../../../src/server/utils/importFiles";
import {Test1} from "./data/Test1";
import {Test2} from "./data/Test2";

describe("importFiles", () => {
  it("should import symbols", async () => {
    const symbols = await importFiles([join(__dirname, "data/*.ts")], []);

    expect(symbols).to.deep.eq([
      "value",
      Test1,
      "value",
      Test2
    ]);
  });

  it("should import symbols without excluded files", async () => {
    const symbols = await importFiles([
        join(__dirname, "data/*.ts")
      ],
      [
        join(__dirname, "data/Test2.ts")
      ]);

    expect(symbols).to.deep.eq([
      "value",
      Test1
    ]);
  });
});
