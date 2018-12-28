import {Store} from "@tsed/core";
import {UseBefore} from "../../../../../packages/common/src/mvc/decorators/method/useBefore";
import {EndpointRegistry} from "../../../../../packages/common/src/mvc/registries/EndpointRegistry";
import {decoratorArgs, descriptorOf} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";

class Test {
  test() {}
}

describe("UseBefore()", () => {
  describe("when the decorator is use on a method", () => {
    before(() => {
      this.endpointRegistryStub = Sinon.stub(EndpointRegistry, "useBefore");

      this.returns = UseBefore(() => {})(...decoratorArgs(Test, "test"));
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
      this.returns = UseBefore(() => {})(Test);

      this.store = Store.from(Test).get("middlewares");
    });
    it("should add the middleware on the use stack", () => {
      expect(this.store.useBefore[0]).to.be.a("function");
    });
    it("should return nothing", () => {
      expect(this.returns).to.eq(undefined);
    });
  });
});
