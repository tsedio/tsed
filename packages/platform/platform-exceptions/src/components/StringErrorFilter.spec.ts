import {PlatformTest} from "@tsed/common";
import {StringErrorFilter} from "./StringErrorFilter";

describe("StringErrorFilter", () => {
  beforeEach(async () => PlatformTest.create());
  afterEach(async () => PlatformTest.reset());
  it("should map message", () => {
    const instance = new StringErrorFilter();
    const ctx = PlatformTest.createRequestContext();

    instance.catch("message", ctx);

    expect(ctx.response.getBody()).toEqual("message");
  });
  it("should map undefined message", () => {
    const instance = new StringErrorFilter();
    const ctx = PlatformTest.createRequestContext();

    instance.catch(undefined as any, ctx);

    expect(ctx.response.getBody()).toEqual("");
  });
});
