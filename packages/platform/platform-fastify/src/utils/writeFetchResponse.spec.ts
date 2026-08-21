import {describe, expect, it, vi} from "vitest";
import {writeFetchResponse} from "./writeFetchResponse.js";

describe("writeFetchResponse", () => {
  it("writes a Fetch response through the Fastify reply boundary", async () => {
    const reply = {
      code: vi.fn(),
      header: vi.fn(),
      raw: {
        write: vi.fn(() => true),
        end: vi.fn((callback) => callback?.()),
        once: vi.fn()
      }
    };

    await writeFetchResponse(
      {
        response: {
          finalize: () => new Response("Hello", {status: 201, headers: {"x-request-id": "request-id"}}),
          native: reply,
          getCookies: () => new Map()
        }
      } as any,
      new Response("Hello", {status: 201, headers: {"x-request-id": "request-id"}})
    );

    expect(reply.code).toHaveBeenCalledWith(201);
    expect(reply.header).toHaveBeenCalledWith("content-type", "text/plain;charset=UTF-8");
    expect(reply.header).toHaveBeenCalledWith("x-request-id", "request-id");
    expect(reply.raw.write).toHaveBeenCalledWith(new TextEncoder().encode("Hello"));
    expect(reply.raw.end).toHaveBeenCalledOnce();
  });

  it("applies a deleted cookie through Fastify", async () => {
    const reply = {
      code: vi.fn(),
      header: vi.fn(),
      raw: {write: vi.fn(() => true), end: vi.fn((callback) => callback?.()), once: vi.fn()},
      setCookie: vi.fn(),
      clearCookie: vi.fn()
    };
    const cookies = new Map([["session", {name: "session", value: null, options: {path: "/"}}]]);

    await writeFetchResponse(
      {response: {finalize: () => new Response(null), native: reply, getCookies: () => cookies}} as any,
      new Response(null)
    );

    expect(reply.clearCookie).toHaveBeenCalledWith("session", {path: "/"});
  });

  it("streams every Fetch chunk before ending the native response", async () => {
    const reply = {
      code: vi.fn(),
      header: vi.fn(),
      raw: {
        write: vi.fn(() => true),
        end: vi.fn((callback) => callback?.()),
        once: vi.fn()
      },
      setCookie: vi.fn(),
      clearCookie: vi.fn()
    };
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("first"));
        controller.enqueue(new TextEncoder().encode("second"));
        controller.close();
      }
    });

    await writeFetchResponse({response: {native: reply, getCookies: () => new Map()}} as any, new Response(stream, {status: 200}));

    expect(reply.raw.write.mock.calls.map(([chunk]) => new TextDecoder().decode(chunk))).toEqual(["first", "second"]);
    expect(reply.raw.end).toHaveBeenCalledOnce();
  });
});
