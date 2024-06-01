import {Enumerable, getEnumerableKeys, NotEnumerable} from "../../src/index.js";

class Test1 {
  test: string = "test";

  @Enumerable()
  name: string = undefined;

  get first() {
    return this.test + " " + this.name;
  }
}

class Parent1 {
  @Enumerable()
  parentProp: string;
}

class Test2 extends Parent1 {
  prop: string = "test";

  @Enumerable()
  test: string = "test";

  @Enumerable()
  name: string = "";

  @NotEnumerable()
  private _privateTest: string = "private";

  @Enumerable(true)
  get first() {
    return this.test + " " + this.name;
  }

  get privateTest(): string {
    return this._privateTest;
  }

  @Enumerable(true)
  set privateTest(value: string) {
    this._privateTest = value;
  }
}

describe("Enumerable", () => {
  it("should have some keys with Test1", () => {
    expect(getEnumerableKeys(new Test1())).toEqual(["test", "name"]);
    expect(Object.keys(new Test1())).toEqual(["test", "name"]);
    expect(Object.getOwnPropertyNames(new Test1())).toEqual(["test", "name"]);
    expect(Reflect.ownKeys(new Test2())).toEqual(["parentProp", "prop", "test", "name", "_privateTest"]);
  });

  it("should have some keys with Test2", () => {
    expect(getEnumerableKeys(new Test2())).toEqual(["parentProp", "prop", "test", "name", "first", "privateTest"]);
    expect(Object.keys(new Test2())).toEqual(["parentProp", "prop", "test", "name", "_privateTest"]);
    expect(Object.getOwnPropertyNames(new Test2())).toEqual(["parentProp", "prop", "test", "name", "_privateTest"]);
    expect(Reflect.ownKeys(new Test2())).toEqual(["parentProp", "prop", "test", "name", "_privateTest"]);
  });
});
