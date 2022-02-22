import {deepExtends} from "../../index";

describe("deepExtends", () => {
  describe("without reducers", () => {
    describe("when is an object", () => {
      it("should merge data (1)", () => {
        expect(
          deepExtends(
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
        const result = deepExtends(
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
          deepExtends(
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
      it("should merge data and prevent prototype pollution", () => {
        const obj = JSON.parse('{"__proto__": {"a": "vulnerable"}, "security":  [{"1": "o"}, {"2": "o1"}]}');

        expect(
          deepExtends(
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
        expect(deepExtends(["1", "2", "4"], ["1", "2", "3"])).toEqual(["1", "2", "4", "3"]);
      });

      it("should merge data (2)", () => {
        expect(deepExtends([{"1": "1"}, {"2": "2"}, {"4": "4"}], [{"1": "1"}, {"2": "2"}, {"3": "3"}])).toEqual([
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
          deepExtends(
            {
              security: ["o"]
            },
            {
              security: ["o", "o1"]
            },
            {
              default: (collection, value) => {
                if (collection.indexOf(value) === -1) {
                  collection.push(value);
                }

                return collection;
              }
            }
          )
        ).toEqual({
          security: ["o", "o1"]
        });
      });

      it("should merge data", () => {
        expect(
          deepExtends(
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
              parameters: (collection, value) => {
                const current = collection.find((current) => current.in === value.in && current.name === value.name);

                if (current) {
                  deepExtends(current, value);
                } else {
                  collection.push(value);
                }

                return collection;
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
        expect(deepExtends(["1", "2", "4"], ["1", "2", "3"])).toEqual(["1", "2", "4", "3"]);
      });

      it("should merge data", () => {
        expect(deepExtends([{"1": "1"}, {"2": "2"}, {"4": "4"}], [{"1": "1"}, {"2": "2"}, {"3": "3"}])).toEqual([
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
