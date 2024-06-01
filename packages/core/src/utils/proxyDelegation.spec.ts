import {proxyDelegation} from "./proxyDelegation.js";

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

    expect(test).toBeInstanceOf(Test);
    expect(test.ownP).toBe("test");
    expect(Object.getOwnPropertyNames(test)).toEqual(["map", "ownP"]);

    test.newProp = "prop";

    expect(test.newProp).toBe("prop");
    expect(test.newProp).toBe("prop");

    expect(Object.getOwnPropertyNames(test)).toEqual(["map", "ownP", "newProp"]);
    expect("newProp" in test).toBe(true);
    expect("ownP" in test).toBe(true);

    delete test.newProp;

    expect(test.newProp).toBeUndefined();
  });
});
