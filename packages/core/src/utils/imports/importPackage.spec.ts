import {importPackage} from "./importPackage";
import {catchAsyncError} from "@tsed/core";

describe("importPackage", () => {
  it("should load package util", async () => {
    const util = await importPackage("util");

    expect(!!util).toBe(true);
  });

  it("should load package from loaderFn", async () => {
    const util = await importPackage("util", () => import("util"));

    expect(!!util).toBe(true);
  });

  it("should throw error", async () => {
    const error = await catchAsyncError(() => importPackage("@tsed/nowhere"));

    expect(error?.message).toContain("Cannot find module");
  });

  it("should ignore missing package", async () => {
    const error = await importPackage("@tsed/nowhere", undefined, true);

    expect(error).toEqual({});
  });
});
