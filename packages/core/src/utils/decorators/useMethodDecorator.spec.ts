import {StoreFn} from "../../decorators/storeFn.js";
import {Store} from "../../domain/Store.js";
import {useDecorators} from "./useDecorators.js";
import {useMethodDecorator, useMethodDecorators} from "./useMethodDecorators.js";

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

    function decorator3(value: any) {
      return (...args: any) => {
        console.log("===", args);
        args[2].value = () => {
          return "hello value";
        };
      };
    }

    function decorate() {
      return useDecorators(useMethodDecorator(decorator2("test3")), useMethodDecorators(decorator1("test1")), decorator2("test2"));
    }

    class Test {
      method(@decorate() param: string) {
        return "";
      }
    }

    const method1 = Store.fromMethod(Test, "method").get("decorator1");
    const method2 = Store.fromMethod(Test, "method").get("decorator2");
    const param = Store.from(Test, "method", 0).get("decorator2");
    expect(method1).toBe("test1");
    expect(method2).toBe("test3");
    expect(param).toBe("test2");
  });
});
