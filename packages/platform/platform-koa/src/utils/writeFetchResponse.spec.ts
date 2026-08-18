import {describe, expect, it, vi} from "vitest";
import {writeFetchResponse} from "./writeFetchResponse.js";

describe("writeFetchResponse", () => {
  it("writes status, headers and a streaming body through Koa", async () => {
    const context = {
      status: 404,
      body: undefined,
      set: vi.fn(),
      cookies: {set: vi.fn()}
    };

    writeFetchResponse({
      response: {
        finalize: () => new Response("Hello", {status: 201, headers: {"x-request-id": "request-id"}}),
        native: {ctx: context},
        getCookies: () => new Map()
      }
    } as any);

    expect(context.status).toBe(201);
    expect(context.set).toHaveBeenCalledWith("content-type", "text/plain;charset=UTF-8");
    expect(context.set).toHaveBeenCalledWith("x-request-id", "request-id");
    await expect(new Response(context.body as any).text()).resolves.toBe("Hello");
  });

  it("sets an empty body", () => {
    const context = {status: 404, body: undefined, set: vi.fn(), cookies: {set: vi.fn()}};

    writeFetchResponse({
      response: {finalize: () => new Response(null, {status: 204}), native: {ctx: context}, getCookies: () => new Map()}
    } as any);

    expect(context.body).toBeNull();
  });
});
