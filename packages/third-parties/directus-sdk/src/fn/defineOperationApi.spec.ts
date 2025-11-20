import {defineOperationApi as oDefineOperationApi} from "@directus/extensions-sdk";
import type {OperationApiConfig} from "@directus/types";
import {beforeEach, describe, expect, it, vi} from "vitest";

import {defineOperationApi} from "./defineOperationApi.js";
import {wrapOperation} from "./wrapOperation.js";

vi.mock("@directus/extensions-sdk", () => ({
  defineOperationApi: vi.fn((config) => config)
}));

vi.mock("./wrapOperation.js", () => ({
  wrapOperation: vi.fn((handler) => handler)
}));

describe("defineOperationApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should wrap operation handler with wrapOperation", () => {
    const handler = vi.fn();
    const config: OperationApiConfig = {
      id: "test-operation",
      handler
    };

    defineOperationApi(config);

    expect(wrapOperation).toHaveBeenCalledWith(handler);
    expect(oDefineOperationApi).toHaveBeenCalled();
  });

  it("should preserve config properties", () => {
    const handler = vi.fn();
    const config: OperationApiConfig = {
      id: "test-operation",
      handler
    };

    const result = defineOperationApi(config);

    expect(result).toHaveProperty("id", "test-operation");
    expect(result).toHaveProperty("handler");
  });

  it("should call original defineOperationApi", () => {
    const handler = vi.fn();
    const config: OperationApiConfig = {
      id: "test-operation",
      handler
    };

    defineOperationApi(config);

    expect(oDefineOperationApi).toHaveBeenCalled();
  });

  it("should return the result from original defineOperationApi", () => {
    const handler = vi.fn();
    const config: OperationApiConfig = {
      id: "test-operation",
      handler
    };
    const expectedResult = {id: "test", handler};
    vi.mocked(oDefineOperationApi).mockReturnValue(expectedResult as any);

    const result = defineOperationApi(config);

    expect(result).toBe(expectedResult);
  });

  it("should handle typed options", () => {
    type CustomOptions = {
      apiKey: string;
      timeout: number;
    };

    const handler = vi.fn();
    const config: OperationApiConfig<CustomOptions> = {
      id: "custom-operation",
      handler: handler as any
    };

    defineOperationApi<CustomOptions>(config);

    expect(wrapOperation).toHaveBeenCalledWith(handler);
    expect(oDefineOperationApi).toHaveBeenCalled();
  });

  it("should spread config correctly", () => {
    const handler = vi.fn();
    const config: OperationApiConfig = {
      id: "test-operation",
      handler
    };

    vi.mocked(oDefineOperationApi).mockImplementation((cfg) => cfg);

    const result = defineOperationApi(config);

    expect(oDefineOperationApi).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "test-operation",
        handler: expect.any(Function)
      })
    );
  });
});
