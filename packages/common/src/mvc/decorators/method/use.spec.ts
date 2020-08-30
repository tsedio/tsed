import {Store} from "@tsed/core";
import {expect} from "chai";
import {EndpointMetadata} from "../../models/EndpointMetadata";
import {Use} from "./use";

describe("Use()", () => {
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      const middleware = () => {};

      class Test {
        @Use(middleware)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");
      expect(endpoint.middlewares).to.deep.eq([middleware]);
    });
  });

  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      const middleware = () => {};

      @Use(middleware)
      class Test {
        test() {}
      }

      const store = Store.from(Test).get("middlewares");
      expect(store.use[0]).to.be.a("function");
      expect(store.use[0]).to.deep.eq(middleware);
    });
  });
});
