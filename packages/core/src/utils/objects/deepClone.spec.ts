import {deepClone} from "./deepClone";

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
      e: function name() {},
      f: Number,
      g: false,
      h: Infinity,
      i: externalObject,
      j: new Test("test"),
      k: [new Test("test"), false, 1, Test],
      l: new RegExp(/test/i)
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
  it("should not change a buffer", () => {
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
});
