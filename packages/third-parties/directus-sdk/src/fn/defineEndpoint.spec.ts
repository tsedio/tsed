import {defineEndpoint as oDefineEndpoint} from "@directus/extensions-sdk";
import type {EndpointConfig} from "@directus/types";
import {beforeEach, describe, expect, it, vi} from "vitest";

import {defineEndpoint} from "./defineEndpoint.js";
import {wrapEndpoint} from "./wrapEndpoint.js";

vi.mock("@directus/extensions-sdk", () => ({
  defineEndpoint: vi.fn((config) => config)
}));

vi.mock("./wrapEndpoint.js", () => ({
  wrapEndpoint: vi.fn((handler) => handler)
}));

describe("defineEndpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should wrap function config with wrapEndpoint", () => {
    const handler = vi.fn();

    defineEndpoint(handler as any);

    expect(wrapEndpoint).toHaveBeenCalledWith(handler);
    expect(oDefineEndpoint).toHaveBeenCalled();
  });

  it("should wrap object config handler with wrapEndpoint", () => {
    const handler = vi.fn();
    const config: EndpointConfig = {
      id: "test-endpoint",
      handler
    };

    defineEndpoint(config);

    expect(wrapEndpoint).toHaveBeenCalledWith(handler);
    expect(oDefineEndpoint).toHaveBeenCalledWith({
      id: "test-endpoint",
      handler
    });
  });

  it("should preserve config properties", () => {
    const handler = vi.fn();
    const config: EndpointConfig = {
      id: "test-endpoint",
      handler
    };

    const result = defineEndpoint(config);

    expect(result).toHaveProperty("id", "test-endpoint");
    expect(result).toHaveProperty("handler");
  });

  it("should call original defineEndpoint", () => {
    const handler = vi.fn();
    const config: EndpointConfig = {
      id: "test-endpoint",
      handler
    };

    defineEndpoint(config);

    expect(oDefineEndpoint).toHaveBeenCalled();
  });

  it("should handle function-only config", () => {
    const handler = vi.fn();

    defineEndpoint(handler as any);

    expect(wrapEndpoint).toHaveBeenCalledWith(handler);
  });

  it("should return the result from original defineEndpoint", () => {
    const handler = vi.fn();
    const expectedResult = {id: "test", handler};
    vi.mocked(oDefineEndpoint).mockReturnValue(expectedResult);

    const result = defineEndpoint(handler as any);

    expect(result).toBe(expectedResult);
  });
});
