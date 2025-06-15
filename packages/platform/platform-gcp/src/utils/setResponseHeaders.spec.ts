import {describe, expect, it, vi} from "vitest";

import {createGCPContext} from "./createGCPContext.js";
import {setResponseHeaders} from "./setResponseHeaders.js";

describe("setResponseHeaders", () => {
  it("should set x-request-id header", () => {
    const context = createGCPContext();
    const spy = vi.spyOn(context.response, "set");

    setResponseHeaders(context);

    expect(spy).toHaveBeenCalledWith("x-request-id", context.id);
  });

  it("should set CORS headers if origin is present", () => {
    const context = createGCPContext();
    vi.spyOn(context.request, "get").mockImplementation((name) => {
      if (name === "origin") {
        return "https://example.com";
      }
      return undefined;
    });
    const spy = vi.spyOn(context.response, "set");

    setResponseHeaders(context);

    expect(spy).toHaveBeenCalledWith("x-request-id", context.id);
    expect(spy).toHaveBeenCalledWith("Access-Control-Allow-Origin", "https://example.com");
    expect(spy).toHaveBeenCalledWith("Access-Control-Allow-Credentials", "true");
    expect(spy).toHaveBeenCalledWith("Vary", "Origin");
  });

  it("should not set CORS headers if origin is not present", () => {
    const context = createGCPContext();
    vi.spyOn(context.request, "get").mockReturnValue(undefined);
    const spy = vi.spyOn(context.response, "set");

    setResponseHeaders(context);

    expect(spy).toHaveBeenCalledWith("x-request-id", context.id);
    expect(spy).not.toHaveBeenCalledWith("Access-Control-Allow-Origin", expect.any(String));
    expect(spy).not.toHaveBeenCalledWith("Access-Control-Allow-Credentials", "true");
    expect(spy).not.toHaveBeenCalledWith("Vary", "Origin");
  });
});
