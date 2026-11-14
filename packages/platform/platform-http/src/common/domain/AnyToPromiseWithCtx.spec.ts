import {AnyToPromiseWithCtx} from "./AnyToPromiseWithCtx.js";
import {PlatformTest} from "../../testing/PlatformTest.js";

describe("AnyToPromiseWithCtx", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return value", async () => {
    const $ctx = PlatformTest.createRequestContext();
    const resolver = new AnyToPromiseWithCtx($ctx);

    const result = await resolver.call(() => "hello");

    expect(result).toEqual({
      data: "hello",
      state: "RESOLVED",
      type: "DATA"
    });
  });

  it("should return a sync value from run() without a promise and pass the resolver to the callback", () => {
    const $ctx = PlatformTest.createRequestContext();
    const resolver = new AnyToPromiseWithCtx($ctx);
    const cb = vi.fn().mockReturnValue("hello");

    const result = resolver.run(cb);

    expect(cb).toHaveBeenCalledWith(resolver);
    expect(result).toEqual({data: "hello", state: "RESOLVED", type: "DATA"});
  });

  it("should cancel from run() when the callback returns the framework response", () => {
    const $ctx = PlatformTest.createRequestContext();
    const resolver = new AnyToPromiseWithCtx($ctx);

    const result = resolver.run(() => $ctx.getResponse());

    expect(result).toEqual({state: "CANCELED"});
  });
});
