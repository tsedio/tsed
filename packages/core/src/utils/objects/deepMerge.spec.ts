import {deepMerge} from "./deepMerge.js";

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
        expect(
          deepMerge(
            {
              prop: {}
            },
            {
              prop: ""
            }
          )
        ).toEqual({
          prop: {}
        });
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
});
