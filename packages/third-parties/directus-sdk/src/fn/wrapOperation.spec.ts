import {ContextLogger, DITest, inject} from "@tsed/di";
import type {OperationContext} from "@directus/types";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {DirectusContextService} from "../services/DirectusContextService.js";
import {wrapOperation} from "./wrapOperation.js";

describe("wrapOperation", () => {
  const operationContext = {} as OperationContext;

  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should return the operation result and make the Directus context available through DI", async () => {
    const handler = vi.fn(() => {
      return {
        context: inject(DirectusContextService).get(),
        success: true
      };
    });

    await expect(wrapOperation(handler)({}, operationContext)).resolves.toEqual({
      context: operationContext,
      success: true
    });
  });

  it("should log, flush and re-throw operation errors", async () => {
    const error = new Error("Operation failed");
    const loggerError = vi.spyOn(ContextLogger.prototype, "error");
    const loggerFlush = vi.spyOn(ContextLogger.prototype, "flush");
    const handler = vi.fn().mockRejectedValue(error);

    await expect(wrapOperation(handler)({}, operationContext)).rejects.toBe(error);

    expect(loggerError).toHaveBeenCalledWith({
      error_name: "Error",
      error_message: "Operation failed",
      error_description: undefined,
      error_stack: error.stack
    });
    expect(loggerFlush).toHaveBeenCalled();
  });
});
