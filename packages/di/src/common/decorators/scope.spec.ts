import {Scope} from "./scope.js";
import {Store} from "@tsed/core";

class Test {}

describe("Scope", () => {
  describe("when parameters is given", () => {
    it("should set metadata", () => {
      Scope("request")(Test);

      expect(Store.from(Test).get("scope")).toEqual("request");
    });
  });

  describe("when parameters is not given", () => {
    beforeAll(() => {});

    it("should set metadata", () => {
      Scope()(Test);

      expect(Store.from(Test).get("scope")).toEqual("request");
    });
  });
});
