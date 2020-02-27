import {Enumerable, getKeys, NotEnumerable} from "../../src";

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
    getKeys(new Test1()).should.deep.eq(["test", "name"]);
    Object.keys(new Test1()).should.deep.eq(["test"]);
    Object.getOwnPropertyNames(new Test1()).should.deep.eq(["test"]);
    Reflect.ownKeys(new Test2()).should.deep.eq(["prop", "test", "_privateTest"]);
  });

  it("should have some keys with Test2", () => {
    getKeys(new Test2()).should.deep.eq(["prop", "test", "first", "privateTest", "name", "parentProp"]);
    Object.keys(new Test2()).should.deep.eq(["prop", "test", "_privateTest"]);
    Object.getOwnPropertyNames(new Test2()).should.deep.eq(["prop", "test", "_privateTest"]);
    Reflect.ownKeys(new Test2()).should.deep.eq(["prop", "test", "_privateTest"]);
  });
});
