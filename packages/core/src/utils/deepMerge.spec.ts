import {deepMerge, mergeReducerBuilder} from "./deepMerge.js";

describe("deepMerge", () => {
  describe("without reducers", () => {
    describe("when is an object", () => {
      it("should merge data (1)", () => {
        expect(
          deepMerge(
            {
              security: ["o"]
            },
            undefined
          )
        ).toEqual({
          security: ["o"]
        });
      });
      it("should merge data (2)", () => {
        const klass = class {
          test = "test";
        };
        const result = deepMerge(
          {
            security: ["o"]
          },
          {
            security: ["o", "o1"],
            withClass: new klass()
          }
        );
        expect(result).toEqual({
          security: ["o", "o1"],
          withClass: {
            test: "test"
          }
        });

        expect(result.withClass).toBeInstanceOf(klass);
      });
      it("should merge data (3)", () => {
        expect(
          deepMerge(
            {
              security: [{"1": "o"}]
            },
            {
              security: [{"1": "o"}, {"2": "o1"}]
            }
          )
        ).toEqual({
          security: [{"1": "o"}, {"1": "o"}, {"2": "o1"}]
        });
      });
      it("should merge data (4)", () => {
        const alter = vi.fn().mockImplementation((key, value) => {
          return value;
        });
        expect(
          deepMerge(
            {
              prop: {}
            },
            {
              prop: ""
            },
            {
              alter
            }
          )
        ).toEqual({
          prop: {}
        });

        expect(alter).toHaveBeenCalledWith("prop", {});
      });
      it("should alter nested properties", () => {
        const alter = vi.fn().mockImplementation((key, value) => {
          return key === "nested" ? {...value, extra: true} : value;
        });
        expect(
          deepMerge(
            {
              prop: {nested: {a: 1}}
            },
            {
              prop: {nested: {b: 2}}
            },
            {alter}
          )
        ).toEqual({
          prop: {nested: {a: 1, b: 2, extra: true}}
        });
        expect(alter).toHaveBeenCalledWith("nested", {a: 1, b: 2});
      });
      it("should merge data and prevent prototype pollution", () => {
        const obj = JSON.parse('{"__proto__": {"a": "vulnerable"}, "security":  [{"1": "o"}, {"2": "o1"}]}');

        expect(
          deepMerge(
            {
              security: [{"1": "o"}]
            },
            obj
          )
        ).toEqual({
          security: [{"1": "o"}, {"1": "o"}, {"2": "o1"}]
        });

        expect(({} as any).a).toBeUndefined();
      });
    });

    describe("when is an array", () => {
      it("should merge data (1)", () => {
        expect(deepMerge(["1", "2", "4"], ["1", "2", "3"])).toEqual(["1", "2", "4", "3"]);
      });

      it("should merge data (2)", () => {
        expect(deepMerge([{"1": "1"}, {"2": "2"}, {"4": "4"}], [{"1": "1"}, {"2": "2"}, {"3": "3"}])).toEqual([
          {"1": "1"},
          {"2": "2"},
          {"4": "4"},
          {"1": "1"},
          {"2": "2"},
          {"3": "3"}
        ]);
      });
    });
  });

  describe("with reducers", () => {
    describe("when is an object", () => {
      it("should merge data", () => {
        expect(
          deepMerge(
            {
              security: ["o"]
            },
            {
              security: ["o", "o1"]
            },
            {
              reducers: {
                default: (collection, value) => {
                  if (collection.indexOf(value) === -1) {
                    collection.push(value);
                  }

                  return collection;
                }
              }
            }
          )
        ).toEqual({
          security: ["o", "o1"]
        });
      });
      it("should merge data (2)", () => {
        expect(
          deepMerge(
            {
              parameters: [
                {in: "test", name: "get", description: "test"},
                {
                  in: "test",
                  name: "post",
                  description: "test"
                }
              ]
            },
            {
              parameters: [
                {in: "test", name: "get", description: "test2"},
                {
                  in: "test",
                  name: "util",
                  description: "test2"
                }
              ]
            },
            {
              reducers: {
                parameters: (collection, value, options) => {
                  const index = collection.findIndex((current) => current.in === value.in && current.name === value.name);

                  if (index === -1) {
                    return [...collection, value];
                  }

                  collection[index] = deepMerge(collection[index], value, options);

                  return collection;
                }
              }
            }
          )
        ).toEqual({
          parameters: [
            {in: "test", name: "get", description: "test2"},
            {in: "test", name: "post", description: "test"},
            {in: "test", name: "util", description: "test2"}
          ]
        });
      });
    });

    describe("when is an array", () => {
      it("should merge data", () => {
        expect(deepMerge(["1", "2", "4"], ["1", "2", "3"])).toEqual(["1", "2", "4", "3"]);
      });
      it("should merge data (2)", () => {
        expect(deepMerge([{"1": "1"}, {"2": "2"}, {"4": "4"}], [{"1": "1"}, {"2": "2"}, {"3": "3"}])).toEqual([
          {"1": "1"},
          {"2": "2"},
          {"4": "4"},
          {"1": "1"},
          {"2": "2"},
          {"3": "3"}
        ]);
      });
    });
  });

  describe("edge cases", () => {
    it("should keep the source keys first, then the new keys of obj", () => {
      expect(Object.keys(deepMerge({b: 1, a: 1}, {c: 2, a: 2}))).toEqual(["b", "a", "c"]);
    });

    it("should read an obj-only key through the source prototype chain", () => {
      const result: any = deepMerge({}, {toString: "value"});

      expect(Object.hasOwn(result, "toString")).toBe(true);
      expect(result.toString).toBe("value");
    });

    it("should ignore the __proto__ key and keep Object.prototype", () => {
      const result: any = deepMerge({a: 1}, JSON.parse('{"__proto__": {"polluted": true}, "b": 2}'));

      expect(result).toEqual({a: 1, b: 2});
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(({} as any).polluted).toBeUndefined();
    });

    it("should skip the holes of a sparse array", () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(deepMerge(["a"], ["b", , "c"])).toEqual(["a", "b", "c"]);
    });

    it("should append a single object merged into an array", () => {
      expect(deepMerge([{a: 1}], {b: 2} as any)).toEqual([{a: 1}, {b: 2}]);
    });

    it("should not mutate the source and obj arrays", () => {
      const source = [{id: 1}];
      const obj = [{id: 1}, {id: 2}];
      const result: any = deepMerge(source, obj);

      expect(source).toEqual([{id: 1}]);
      expect(obj).toEqual([{id: 1}, {id: 2}]);
      expect(result).not.toBe(source);
    });

    it("should return a new array when a reducer built with mergeReducerBuilder appends a value", () => {
      const reducer = mergeReducerBuilder((a, b) => a.id === b.id);
      const collection = [{id: 1}];
      const result = reducer(collection, {id: 2}, {});

      expect(result).toEqual([{id: 1}, {id: 2}]);
      expect(collection).toEqual([{id: 1}]);
    });

    it("should give the parentKey to the reducer of a nested array and the user options at the top level", () => {
      const calls: any[] = [];
      const options = {
        reducers: {
          default: (collection: any[], value: any, opts: any) => {
            calls.push(opts);
            return [...collection, value];
          }
        }
      };

      deepMerge({list: [1]}, {list: [2]}, options);
      deepMerge([1], [2], options);

      expect(calls[0].parentKey).toBe("list");
      expect(calls[0].reducers).toBe(options.reducers);
      expect(calls.at(-1)).toBe(options);
    });

    it("should drop undefined values with cleanUndefinedProps", () => {
      expect(deepMerge({a: undefined, b: 1}, {c: undefined}, {cleanUndefinedProps: true})).toEqual({b: 1});
      expect(Object.keys(deepMerge({a: undefined}, {c: undefined}) as any)).toEqual(["a", "c"]);
    });

    it("should return obj for primitives, symbols, functions and Boolean objects", () => {
      const symbol = Symbol("s");
      const fn = () => {};
      const bool = new Boolean(true);

      expect(deepMerge({a: 1}, "str")).toBe("str");
      expect(deepMerge({a: 1}, 1)).toBe(1);
      expect(deepMerge({a: 1}, false)).toBe(false);
      expect(deepMerge({a: 1}, symbol)).toBe(symbol);
      expect(deepMerge({a: 1}, fn)).toBe(fn);
      expect(deepMerge({a: 1}, bool)).toBe(bool);
      expect(deepMerge({a: 1}, Boolean)).toBe(Boolean);
      expect(deepMerge("", "")).toBe("");
      expect(deepMerge("a", "")).toBe("a");
    });

    it("should create the result from the source class", () => {
      class Model {
        a = 1;
      }

      const source = new Model();
      const result: any = deepMerge(source, {b: 2});

      expect(Object.getPrototypeOf(result)).toBe(source);
      expect(result.b).toBe(2);
    });
  });
});
