import {deepClone} from "./deepClone.js";

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

  describe("behaviour kept by the optimized implementation", () => {
    it("should keep the holes of a sparse array", () => {
      // eslint-disable-next-line no-sparse-arrays
      const result = deepClone(["a", , "b"]);

      expect(result).toHaveLength(3);
      expect(1 in result).toBe(false);
    });

    it("should keep the property descriptors", () => {
      const source = {};
      Object.defineProperty(source, "hidden", {value: {a: 1}, enumerable: false, writable: false, configurable: false});
      const result = deepClone(source);

      expect(Object.getOwnPropertyDescriptor(result, "hidden")).toEqual({
        value: {a: 1},
        enumerable: false,
        writable: false,
        configurable: false
      });
      expect(result.hidden).not.toBe((source as any).hidden);
    });

    it("should clone symbol keys", () => {
      const key = Symbol("key");
      const source = {[key]: {a: 1}};
      const result = deepClone(source);

      expect(result[key]).toEqual({a: 1});
      expect(result[key]).not.toBe(source[key]);
    });

    it("should keep an own __proto__ key without changing the prototype", () => {
      const result = deepClone(JSON.parse('{"__proto__": {"x": 1}, "a": 1}'));

      expect(Object.hasOwn(result, "__proto__")).toBe(true);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(result.a).toBe(1);
    });

    it("should clone an object without prototype", () => {
      const source = Object.assign(Object.create(null), {a: {b: 1}});
      const result = deepClone(source);

      expect(Object.getPrototypeOf(result)).toBeNull();
      expect(result.a).toEqual({b: 1});
      expect(result.a).not.toBe(source.a);
    });

    it("should keep function values by reference", () => {
      const fn = () => {};
      expect(deepClone({fn}).fn).toBe(fn);
    });

    it("should define the properties instead of assigning them", () => {
      class Base {
        set value(_v: any) {
          throw new Error("setter called");
        }
      }

      const source = Object.create(Base.prototype);
      Object.defineProperty(source, "value", {value: 1, enumerable: true, writable: true, configurable: true});

      expect(deepClone(source).value).toBe(1);
    });

    it("should share the clone of an object referenced twice", () => {
      const shared = {a: 1};
      const result = deepClone({x: shared, y: [shared]});

      expect(result.x).toBe(result.y[0]);
    });
  });

  it("should clone own accessor properties", () => {
    const source = {};
    Object.defineProperty(source, "computed", {get: () => 1, enumerable: true, configurable: true});

    const result = deepClone(source);

    expect(result.computed).toBe(1);
    expect(Object.getOwnPropertyDescriptor(result, "computed")?.get).toBeTypeOf("function");
  });
});
