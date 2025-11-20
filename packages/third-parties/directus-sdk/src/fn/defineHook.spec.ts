import {catchAsyncError} from "@tsed/core";
import {inject, logger} from "@tsed/di";
import {describe, it} from "vitest";

import {DirectusContextService} from "../services/DirectusContextService.js";
import {defineHook} from "./defineHook.js";

describe("defineHook", () => {
  it("should define hook", async () => {
    const r: any = {};
    const c: any = {};

    const hookHandler = defineHook((register, context) => {
      expect(register).toEqual(r);
      expect(register).toEqual(c);

      expect(inject(DirectusContextService)).toEqual(c);

      return "hello";
    });

    const result = await hookHandler(r, c);

    expect(result).toEqual("hello");
  });
  it("should define hook and catch error", async () => {
    const r: any = {};
    const c: any = {};

    vi.spyOn(logger(), "error").mockReturnValue(undefined);

    const hookHandler = defineHook((register, context) => {
      throw new Error("error");
    });

    const result = await catchAsyncError(() => hookHandler(r, c));

    expect(result?.name).toEqual("Error");
    expect(logger().error).toHaveBeenCalledWith({
      duration: expect.any(Number),
      error_description: undefined,
      error_message: "error",
      error_name: "Error",
      error_stack: expect.any(String),
      reqId: expect.any(String),
      time: expect.any(Date)
    });
  });
});
