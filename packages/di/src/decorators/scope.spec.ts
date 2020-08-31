import {Store} from "@tsed/core";
import {expect} from "chai";
import {Scope} from "../../src";

class Test {}

describe("Scope", () => {
  describe("when parameters is given", () => {
    it("should set metadata", () => {
      Scope("request")(Test);

      expect(Store.from(Test).get("scope")).to.eq("request");
    });
  });

  describe("when parameters is not given", () => {
    before(() => {});

    it("should set metadata", () => {
      Scope()(Test);

      expect(Store.from(Test).get("scope")).to.eq("request");
    });
  });
});
