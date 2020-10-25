import {proxyDelegation} from "@tsed/core";
import {expect} from "chai";

describe("proxyDelegation", () => {
  it("should create proxy delegation with internal map", () => {
    class Test {
      readonly map: Map<string, string> = new Map();
      public ownP: string = "test";

      [key: string]: any;

      constructor() {
        return proxyDelegation<Test>(this, {
          getter(target, property) {
            return target.map.get(String(property));
          },
          setter(target, property, value) {
            return target.map.set(String(property), value);
          },
          remove(target, prop) {
            return target.map.delete(String(prop));
          },
          ownKeys(target) {
            return [...target.map.keys()];
          }
        });
      }
    }

    const test = new Test();

    expect(test).instanceof(Test);
    expect(test.ownP).to.equal("test");
    expect(Object.getOwnPropertyNames(test)).to.deep.equal(["map", "ownP"]);

    test.newProp = "prop";

    expect(test.newProp).to.equal("prop");
    expect(test.newProp).to.equal("prop");

    expect(Object.getOwnPropertyNames(test)).to.deep.equal(["map", "ownP", "newProp"]);
    expect("newProp" in test).to.equal(true);
    expect("ownP" in test).to.equal(true);

    delete test.newProp;

    expect(test.newProp).to.equal(undefined);
  });
});
