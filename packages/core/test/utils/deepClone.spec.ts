import {expect} from "chai";
import {deepClone} from "../../src/utils/deepClone";

describe("deepClone", () => {
  it("should clone object", () => {
    const externalObject = {
      color: "red"
    };

    class Base {
      public test2: string;

      constructor(test: string) {
        this.test2 = test + "2";
      }

      get test3(): string {
        return this.test2;
      }
    }

    class Test extends Base {
      constructor(private _test: string) {
        super(_test);
      }

      get test(): string {
        return this._test;
      }
    }

    const original = {
      a: new Date(),
      b: NaN,
      c: new Function(),
      d: undefined,
      e: function name() {
      },
      f: Number,
      g: false,
      h: Infinity,
      i: externalObject,
      j: new Test("test"),
      k: [new Test("test"), false, 1, Test]
    };

    const cloned = deepClone(original);

    expect(cloned).to.deep.eq(original);
    expect(cloned).not.to.eq(original);

    expect(cloned.j).instanceOf(Test);
    expect(cloned.j.test).to.eq("test");
    expect(cloned.j.test2).to.eq("test2");

    expect(cloned.k).instanceOf(Array);
    expect(cloned.k.length).to.eq(4);
    expect(cloned.k[0]).instanceOf(Test);
    expect(cloned.k[3]).eq(Test);

    expect(deepClone(new Test("test"))).instanceOf(Test);
  });
});
