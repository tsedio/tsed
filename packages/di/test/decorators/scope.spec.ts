import {Store} from "@tsed/core";
import {Scope} from "../../src";

class Test {
}

describe("Scope", () => {
  describe("when parameters is given", () => {
    it("should set metadata", () => {
      Scope("request")(Test);

      Store.from(Test).get("scope").should.eq("request");
    });
  });

  describe("when parameters is not given", () => {
    before(() => {

    });

    it("should set metadata", () => {
      Scope()(Test);

      Store.from(Test).get("scope").should.eq("request");
    });
  });
});
