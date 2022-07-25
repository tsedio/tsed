import {PlatformTest} from "../services/PlatformTest";
import {AnyToPromiseWithCtx} from "./AnyToPromiseWithCtx";

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
});
