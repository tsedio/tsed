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
  it("should use empty options when not provided", () => {
    const builder = injectable(TestService).directusCache("test");

    expect(getInterceptorOptions(builder.token(), "test")).toEqual({});
  });

  it("should support chaining multiple directusCache calls", () => {
    class MultiMethodService {
      methodA() {
        return "a";
      }

      methodB() {
        return "b";
      }
    }

    const builder = injectable(MultiMethodService).directusCache("methodA", {ttl: 100}).directusCache("methodB", {ttl: 200});

    expect(getInterceptorOptions(builder.token(), "methodA")).toEqual({ttl: 100});
    expect(getInterceptorOptions(builder.token(), "methodB")).toEqual({ttl: 200});
  });
});
