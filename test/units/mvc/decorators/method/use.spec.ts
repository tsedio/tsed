import {Store} from "@tsed/core";
import {Use} from "../../../../../packages/common/src/mvc/decorators/method/use";
import {EndpointRegistry} from "../../../../../packages/common/src/mvc/registries/EndpointRegistry";
import {decoratorArgs, descriptorOf} from "../../../../../packages/core/src/utils";
import {expect, Sinon} from "../../../../tools";

class Test {
  test() {}
}

describe("Use()", () => {
  describe("when the decorator is use on a method", () => {
    before(() => {
      this.endpointRegistryStub = Sinon.stub(EndpointRegistry, "use");

      this.returns = Use(() => {})(...decoratorArgs(Test, "test"));
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
      this.returns = Use(() => {})(Test);

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
