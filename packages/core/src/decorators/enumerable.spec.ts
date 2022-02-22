import {Enumerable, getEnumerableKeys, NotEnumerable} from "../../src";

class Test1 {
  test: string = "test";

  @Enumerable()
  name: string;

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
  name: string;

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
    expect(Object.keys(new Test1())).toEqual(["test"]);
    expect(Object.getOwnPropertyNames(new Test1())).toEqual(["test"]);
    expect(Reflect.ownKeys(new Test2())).toEqual(["prop", "test", "_privateTest"]);
  });

  it("should have some keys with Test2", () => {
    expect(getEnumerableKeys(new Test2())).toEqual(["prop", "test", "first", "privateTest", "name", "parentProp"]);
    expect(Object.keys(new Test2())).toEqual(["prop", "test", "_privateTest"]);
    expect(Object.getOwnPropertyNames(new Test2())).toEqual(["prop", "test", "_privateTest"]);
    expect(Reflect.ownKeys(new Test2())).toEqual(["prop", "test", "_privateTest"]);
  });
});
