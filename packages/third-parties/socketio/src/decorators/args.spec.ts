import {Store} from "@tsed/core";

import {Args} from "../index.js";

describe("Args", () => {
  describe("without parameters", () => {
    beforeAll(() => {});

    it("should set metadata", () => {
      class Test {}

      Args()(Test, "test", 0);

      const store = Store.from(Test);

      expect(store.get("socketIO")).toEqual({
        handlers: {
          test: {
            parameters: {
              "0": {
                filter: "args",
                useMapper: false
              }
            }
          }
        }
      });
    });
  });

  describe("with parameters", () => {
    beforeAll(() => {});

    it("should set metadata", () => {
      class Test {}

      Args(1)(Test, "test", 1);
      const store = Store.from(Test);

      expect(store.get("socketIO")).toEqual({
        handlers: {
          test: {
            parameters: {
              "1": {
                collectionType: undefined,
                filter: "args",
                mapIndex: 1,
                type: undefined,
                useMapper: true
              }
            }
          }
        }
      });
    });
  });
});
