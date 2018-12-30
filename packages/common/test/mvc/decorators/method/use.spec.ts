import {decoratorArgs, descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {EndpointRegistry, Use} from "../../../../src/mvc";

class Test {
  test() {
  }
}

describe("Use()", () => {
  describe("when the decorator is use on a method", () => {
    before(() => {
      this.endpointRegistryStub = Sinon.stub(EndpointRegistry, "use");

      this.returns = Use(() => {
      })(...decoratorArgs(Test, "test"));
    });

    after(() => {
      this.endpointRegistryStub.restore();
    });

    it("should add the middleware on the use stack", () => {
      this.endpointRegistryStub.should.be.calledWithExactly(Test, "test", [Sinon.match.func]);
    });

    it("should return a descriptor", () => {
      this.returns.should.be.deep.eq(descriptorOf(Test, "test"));
    });
  });

  describe("when the decorator is use on a class", () => {
    before(() => {
      this.returns = Use(() => {
      })(Test);

      this.store = Store.from(Test).get("middlewares");
    });

    it("should add the middleware on the use stack", () => {
      expect(this.store.use[0]).to.be.a("function");
    });
    it("should return nothing", () => {
      expect(this.returns).to.eq(undefined);
    });
  });
});
