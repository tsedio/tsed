import {writeFetchResponse} from "./writeFetchResponse.js";

describe("writeFetchResponse", () => {
  it("should write Fetch status, headers and body to Express", async () => {
    const native = {
      status: vi.fn(),
      set: vi.fn(),
      write: vi.fn().mockReturnValue(true),
      end: vi.fn((callback?: () => void) => callback?.()),
      once: vi.fn()
    };

    await writeFetchResponse({
      response: {
        finalize: () => new Response("hello", {headers: {"x-request-id": "request-id"}, status: 201}),
        native,
        getCookies: () => new Map()
      }
    } as any);

    expect(native.status).toHaveBeenCalledWith(201);
    expect(native.set).toHaveBeenCalledWith("x-request-id", "request-id");
    expect(new TextDecoder().decode(native.write.mock.calls[0][0])).toBe("hello");
    expect(native.end).toHaveBeenCalledOnce();
  });

  it("should finish an empty Fetch response", async () => {
    const native = {
      status: vi.fn(),
      set: vi.fn(),
      write: vi.fn(),
      end: vi.fn((callback?: () => void) => callback?.()),
      once: vi.fn()
    };

    await writeFetchResponse({response: {finalize: () => new Response(null, {status: 204}), native, getCookies: () => new Map()}} as any);

    expect(native.write).not.toHaveBeenCalled();
    expect(native.end).toHaveBeenCalledOnce();
  });

  it("should apply cookie mutations through Express", async () => {
    const native = {
      status: vi.fn(),
      set: vi.fn(),
      write: vi.fn(),
      end: vi.fn((callback?: () => void) => callback?.()),
      once: vi.fn(),
      cookie: vi.fn(),
      clearCookie: vi.fn()
    };
    const cookies = new Map([["session", {name: "session", value: "value", options: {httpOnly: true}}]]);

    await writeFetchResponse({response: {finalize: () => new Response(null), native, getCookies: () => cookies}} as any);

    expect(native.cookie).toHaveBeenCalledWith("session", "value", {httpOnly: true});
  });
});
