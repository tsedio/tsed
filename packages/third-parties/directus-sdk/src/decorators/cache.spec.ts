import {Intercept} from "@tsed/di";
import {DITest} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {DirectusCacheInterceptor} from "../services/DirectusCacheInterceptor.js";
import {Cache} from "./cache.js";

vi.mock("@tsed/di", async () => {
  const actual = await vi.importActual("@tsed/di");
  return {
    ...actual,
    Intercept: vi.fn()
  };
});

describe("@Cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    DITest.reset();
  });

  it("should call Intercept with DirectusCacheInterceptor and options", () => {
    const options = {ttl: 900000};

    Cache(options);

    expect(Intercept).toHaveBeenCalledWith(DirectusCacheInterceptor, options);
  });

  it("should pass custom ttl option", () => {
    const options = {ttl: 60000};

    Cache(options);

    expect(Intercept).toHaveBeenCalledWith(DirectusCacheInterceptor, options);
  });

  it("should pass custom keyGenerator option", () => {
    const keyGenerator = (id: string) => `custom-${id}`;
    const options = {ttl: 900000, keyGenerator};

    Cache(options);

    expect(Intercept).toHaveBeenCalledWith(DirectusCacheInterceptor, options);
  });

  it("should pass custom namespace option", () => {
    const options = {ttl: 900000, namespace: "custom:namespace"};

    Cache(options);

    expect(Intercept).toHaveBeenCalledWith(DirectusCacheInterceptor, options);
  });

  it("should pass useSystemCache option", () => {
    const options = {ttl: 900000, useSystemCache: false};

    Cache(options);

    expect(Intercept).toHaveBeenCalledWith(DirectusCacheInterceptor, options);
  });

  it("should pass all options combined", () => {
    const keyGenerator = (id: string) => `id-${id}`;
    const options = {
      ttl: 30000,
      keyGenerator,
      namespace: "test:cache",
      useSystemCache: false
    };

    Cache(options);

    expect(Intercept).toHaveBeenCalledWith(DirectusCacheInterceptor, options);
  });

  it("should return the result of Intercept", () => {
    const mockDecorator = vi.fn();
    vi.mocked(Intercept).mockReturnValue(mockDecorator as any);

    const options = {ttl: 900000};
    const result = Cache(options);

    expect(result).toBe(mockDecorator);
  });
});
