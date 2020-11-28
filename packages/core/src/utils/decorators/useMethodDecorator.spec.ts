import {Store, StoreFn, useDecorators, useMethodDecorator, useMethodDecorators} from "@tsed/core";
import {expect} from "chai";

describe("useMethodDecorators", () => {
  it("should apply all decorators", () => {
    function decorator1(value: any) {
      return StoreFn((store) => {
        store.set("decorator1", value);
      });
    }

    function decorator2(value: any) {
      return StoreFn((store) => {
        store.set("decorator2", value);
      });
    }

    function decorate() {
      return useDecorators(useMethodDecorator(decorator2("test3")), useMethodDecorators(decorator1("test1")), decorator2("test2"));
    }

    class Test {
      method(@decorate() param: string) {}
    }

    const method1 = Store.fromMethod(Test, "method").get("decorator1");
    const method2 = Store.fromMethod(Test, "method").get("decorator2");
    const param = Store.from(Test, "method", 0).get("decorator2");
    expect(method1).to.eq("test1");
    expect(method2).to.eq("test3");
    expect(param).to.eq("test2");
  });
});
