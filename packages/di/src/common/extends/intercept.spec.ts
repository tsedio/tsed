import "./intercept.js";

import {nameOf} from "@tsed/core";

import {DITest} from "../../node/services/DITest.js";
import {getInterceptorOptions} from "../decorators/intercept.js";
import {injectable, interceptor} from "../fn/injectable.js";
import {InterceptorContext} from "../interfaces/InterceptorContext.js";
import type {InterceptorMethods} from "../interfaces/InterceptorMethods.js";

class MyInterceptor implements InterceptorMethods {
  intercept(context: InterceptorContext<any>) {
    const r = typeof context.args[0] === "string" ? undefined : new Error(`Error message`);
    const retValue = context.next(r);

    expect(nameOf(context.target)).toContain("Service");

    return `${retValue} - ${context.options.test || ""} - intercepted 1`;
  }
}

interceptor(MyInterceptor);

class ServiceTest {
  exec(param: string) {
    return `Original data - ${param}`;
  }
}

class ServiceTest2 {
  exec(param: string) {
    return `Original data - ${param}`;
  }
}

injectable(ServiceTest).intercept("exec", MyInterceptor, {test: "option data"}).type("service:test");

injectable(Symbol.for("test")).class(ServiceTest2).intercept("exec", MyInterceptor, {test: "option data"}).type("service:test");

describe("extends: intercept", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  describe("when the decorator is used on a method", () => {
    it("should intercept the method", async () => {
      // GIVEN
      const serviceTest = await DITest.invoke<ServiceTest>(ServiceTest)!;

      // WHEN
      const result = serviceTest.exec("param data");

      expect(getInterceptorOptions(ServiceTest, "exec")).toEqual({test: "option data"});

      // THEN
      expect(result).toEqual("Original data - param data - option data - intercepted 1");
    });
  });
});
