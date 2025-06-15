import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {isInGCP} from "./isInGCP.js";

describe("isInGCP", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {...originalEnv};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return true if FUNCTION_NAME is defined", () => {
    process.env.FUNCTION_NAME = "test-function";

    expect(isInGCP()).toBe(true);
  });

  it("should return true if FUNCTION_TARGET is defined", () => {
    process.env.FUNCTION_TARGET = "test-function";

    expect(isInGCP()).toBe(true);
  });

  it("should return true if FUNCTION_SIGNATURE_TYPE is defined", () => {
    process.env.FUNCTION_SIGNATURE_TYPE = "http";

    expect(isInGCP()).toBe(true);
  });

  it("should return true if K_SERVICE is defined", () => {
    process.env.K_SERVICE = "test-service";

    expect(isInGCP()).toBe(true);
  });

  it("should return true if GOOGLE_CLOUD_PROJECT is defined", () => {
    process.env.GOOGLE_CLOUD_PROJECT = "test-project";

    expect(isInGCP()).toBe(true);
  });

  it("should return false if no GCP environment variables are defined", () => {
    delete process.env.FUNCTION_NAME;
    delete process.env.FUNCTION_TARGET;
    delete process.env.FUNCTION_SIGNATURE_TYPE;
    delete process.env.K_SERVICE;
    delete process.env.GOOGLE_CLOUD_PROJECT;

    expect(isInGCP()).toBe(false);
  });
});
