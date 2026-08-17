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

    await writeFetchResponse(
      new Response("hello", {
        headers: {"x-request-id": "request-id"},
        status: 201
      }),
      native
    );

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

    await writeFetchResponse(new Response(null, {status: 204}), native);

    expect(native.write).not.toHaveBeenCalled();
    expect(native.end).toHaveBeenCalledOnce();
  });
});
