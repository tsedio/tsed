import {deepClone} from "./deepClone";

describe("deepClone", () => {
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

  it("should clone object", () => {
    const externalObject = {
      color: "red"
    };
    const symbol = Symbol("test");
    const original = {
      a: new Date(),
      b: NaN,
      c: new Function(),
      d: undefined,
      e: function name() {},
      f: Number,
      g: false,
      h: Infinity,
      i: externalObject,
      j: new Test("test"),
      k: [new Test("test"), false, 1, Test],
      l: new RegExp(/test/i),
      m: null,
      n: symbol
    };

    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    expect(cloned.j).toBeInstanceOf(Test);
    expect(cloned.j.test).toBe("test");
    expect(cloned.j.test2).toBe("test2");

    expect(cloned.k).toBeInstanceOf(Array);
    expect(cloned.k.length).toBe(4);
    expect(cloned.k[0]).toBeInstanceOf(Test);
    expect(cloned.k[3]).toBe(Test);

    expect(cloned.l).toBeInstanceOf(RegExp);
    expect(cloned.l.source).toBe("test");
    expect(cloned.l.flags).toBe("i");

    expect(cloned.m).toBeNull();
    expect(cloned.n).toBe(symbol);

    expect(deepClone(new Test("test"))).toBeInstanceOf(Test);
  });

  it("should clone object with circular obj", () => {
    const original = {
      posts: [
        {
          id: 0,
          user: {}
        }
      ],
      user: {
        id: 1,
        posts: [] as any[]
      }
    };

    original.posts[0].user = original.user;
    original.user.posts.push(original.posts[0]);

    expect(deepClone(original)).toEqual(original);
  });

  it("should clone a buffer", () => {
    class FakeStorage {
      testBuffer: Buffer;

      constructor() {
        this.testBuffer = Buffer.from("Hello");
      }

      get() {
        return this.testBuffer.toString("utf-8");
      }
    }

    const result = deepClone({storage: new FakeStorage()});
    expect(result.storage.get()).toEqual("Hello");
  });

  it("should clone Map, Set, and Array", () => {
    class FakeStorage {
      set = new Set([new Test("test")]);
      map = new Map([["test", Test]]);
      array = [new Test("test"), Test, new Map([["test", new Test("test")]])];
    }

    const expected = {storage: new FakeStorage()};
    const result = deepClone(expected);

    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
  });

  it("should clone typed arrays", () => {
    const original = new Int8Array([1, 2, 3]);
    const result = deepClone(original);

    expect(result).toEqual(original);
    expect(result).toBeInstanceOf(Int8Array);
  });
});
