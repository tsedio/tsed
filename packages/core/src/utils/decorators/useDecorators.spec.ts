import {StoreFn} from "../../decorators/storeFn.js";
import {Store} from "../../domain/Store.js";
import {AnyDecorator} from "../../interfaces/AnyDecorator.js";
import {useDecorators} from "./useDecorators.js";

describe("useDecorators", () => {
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

  function decorate(): AnyDecorator {
    return useDecorators(decorator1("test1"), decorator2("test2"));
  }

  @decorate()
  class Test {}

  it("should apply all decorators", () => {
    expect(Store.from(Test).get("decorator1")).toBe("test1");
    expect(Store.from(Test).get("decorator2")).toBe("test2");
  });
});
