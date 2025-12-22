import "./cache.js";

import {DITest, getInterceptorOptions, injectable} from "@tsed/di";

class Test {
  test() {
    return "test";
  }
}

describe("extends: injectable.cache", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should define cache", () => {
    const builder = injectable(Test).cache("test", {ttl: 300});

    expect(getInterceptorOptions(builder.token(), "test")).toEqual({ttl: 300});
  });
});
