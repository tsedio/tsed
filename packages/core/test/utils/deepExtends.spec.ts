import {expect} from "chai";
import {deepExtends} from "../../src";

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
        ).to.deep.eq({
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
            withClass: new klass
          }
        );
        expect(result).to.deep.eq({
          security: ["o", "o1"],
          withClass: {
            "test": "test"
          }
        });

        expect(result.withClass).to.be.instanceof(klass);
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
        ).to.deep.eq({
          security: [{"1": "o"}, {"1": "o"}, {"2": "o1"}]
        });
      });
    });

    describe("when is an array", () => {
      it("should merge data (1)", () => {
        expect(deepExtends(["1", "2", "4"], ["1", "2", "3"])).to.deep.eq(["1", "2", "4", "3"]);
      });

      it("should merge data (2)", () => {
        expect(deepExtends([{"1": "1"}, {"2": "2"}, {"4": "4"}], [{"1": "1"}, {"2": "2"}, {"3": "3"}])).to.deep.eq([
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
        ).to.deep.eq({
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
                const current = collection.find(current => current.in === value.in && current.name === value.name);

                if (current) {
                  deepExtends(current, value);
                } else {
                  collection.push(value);
                }

                return collection;
              }
            }
          )
        ).to.deep.eq({
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
        expect(deepExtends(["1", "2", "4"], ["1", "2", "3"])).to.deep.eq(["1", "2", "4", "3"]);
      });

      it("should merge data", () => {
        expect(deepExtends([{"1": "1"}, {"2": "2"}, {"4": "4"}], [{"1": "1"}, {"2": "2"}, {"3": "3"}])).to.deep.eq([
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
