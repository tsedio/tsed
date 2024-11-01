import {StoreMerge} from "../../decorators/storeMerge.js";
import {StoreSet} from "../../decorators/storeSet.js";
import {Store} from "../../domain/Store.js";
import {descriptorOf} from "../objects/descriptorOf.js";
import {decorateMethodsOf} from "./decorateMethodsOf.js";

describe("decorateMethodsOf", () => {
  it("should decorate all methods", () => {
    function decorate() {
      return (target: any) => {
        decorateMethodsOf(target, (klass: any, property: any, descriptor: any) => {
          Store.from(klass, property, descriptor).set("test", property);

          return descriptor;
        });
      };
    }

    class TestParent {
      test2(a: any) {
        return "test" + a;
      }
    }

    // WHEN
    @decorate()
    class Test extends TestParent {
      test() {}
    }

    // THEN
    const result = Store.from(Test, "test", descriptorOf(Test, "test")).get("test");
    expect(result).toBe("test");

    const result2 = Store.from(Test, "test2", descriptorOf(Test, "test2")).get("test");
    expect(result2).toBe("test2");

    expect(new Test().test2("1")).toBe("test1");
  });
  it("should decorate all methods and copy store metadata to the new property", () => {
    function decorate() {
      return (target: any) => {
        decorateMethodsOf(target, (klass: any, property: any, descriptor: any) => {
          Store.from(klass, property, descriptor).set("test", property);
        });
      };
    }

    class TestParent {
      @StoreSet("options", {parent: "test", override: "parent"})
      test(a: any) {}

      @StoreSet("options", {parent: "test2"})
      test2(a: any) {}
    }

    // WHEN
    @decorate()
    class Test extends TestParent {
      @StoreMerge("options", {children: "test", override: "child"})
      test() {}
    }

    // THEN
    const storeObj2 = Store.fromMethod(Test, "test2").toJson();
    expect(storeObj2).toEqual({
      options: {
        parent: "test2"
      },
      test: "test2"
    });

    const storeObj = Store.fromMethod(Test, "test").toJson();
    // store aren't merged
    expect(storeObj).toEqual({
      options: {
        children: "test",
        override: "child"
      },
      test: "test"
    });
  });
});
