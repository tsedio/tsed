import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {decorateMethodsOf} from "./decorateMethodsOf";

describe("decorateMethodsOf", () => {
  it("should decorate all methods", () => {
    function decorate() {
      return (target: any) => {
        decorateMethodsOf(target, (klass: any, property: any, descriptor: any) => {
          Store.from(klass, property, descriptor).set("test", property);
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
    expect(result).to.eq("test");

    const result2 = Store.from(Test, "test2", descriptorOf(Test, "test2")).get("test");
    expect(result2).to.eq("test2");

    expect(new Test().test2("1")).to.eq("test1");
  });
});
