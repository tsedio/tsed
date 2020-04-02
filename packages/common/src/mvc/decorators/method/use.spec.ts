import {decoratorArgs, descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {EndpointRegistry, Use} from "../../../../src/mvc";

class Test {
  test() {}
}

describe("Use()", () => {
  describe("when the decorator is use on a method", () => {
    before(() => {
      Sinon.stub(EndpointRegistry, "use");
    });

    after(() => {
      // @ts-ignore
      EndpointRegistry.use.restore();
    });

    it("should add the middleware on the use stack", () => {
      const returns = Use(() => {})(...decoratorArgs(Test, "test"));

      EndpointRegistry.use.should.be.calledWithExactly(Test, "test", [Sinon.match.func]);
      returns.should.be.deep.eq(descriptorOf(Test, "test"));
    });
  });

  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      const returns = Use(() => {})(Test);

      const store = Store.from(Test).get("middlewares");
      expect(store.use[0]).to.be.a("function");
      expect(returns).to.eq(undefined);
    });
  });
});
