import "./cache.js";

import {DITest, getInterceptorOptions, injectable} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

class TestService {
  test() {
    return "test";
  }
}

describe("extends: injectable.directusCache", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should define directus cache options on the method", () => {
    const builder = injectable(TestService).directusCache("test", {ttl: 900000});

    expect(getInterceptorOptions(builder.token(), "test")).toEqual({ttl: 900000});
  });
});
