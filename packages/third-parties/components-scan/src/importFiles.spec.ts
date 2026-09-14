import {Test1} from "./__mock__/Test1.js";
import {Test2} from "./__mock__/Test2.js";
import {importFiles} from "./importFiles.js";
import {join} from "node:path";
import {pathToFileURL} from "node:url";

vi.mock("node:url", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:url")>();

  return {...actual, pathToFileURL: vi.fn(actual.pathToFileURL)};
});

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

describe("importFiles", () => {
  it("should import symbols", async () => {
    const symbols = await importFiles([join(rootDir, "__mock__/*.ts")], []);

    expect(symbols.sort()).toEqual(["value", Test1, "value", Test2].sort());
  });

  it("should import files through file URLs", async () => {
    await importFiles([join(rootDir, "__mock__/*.ts")], []);

    expect(pathToFileURL).toHaveBeenCalledWith(expect.stringMatching(/__mock__\/Test1\.ts$/));
  });

  it("should import symbols without excluded files", async () => {
    const symbols = await importFiles([join(rootDir, "__mock__/*.ts")], [join(rootDir, "__mock__/Test2.ts")]);

    expect(symbols.sort()).toEqual(["value", Test1].sort());
  });
});
