import {PlatformTest} from "@tsed/platform-http/testing";

import {StringErrorFilter} from "./StringErrorFilter.js";

describe("StringErrorFilter", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
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
