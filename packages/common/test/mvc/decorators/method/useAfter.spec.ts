import {prototypeOf, Store, UnsupportedDecoratorType} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointRegistry, UseAfter} from "../../../../src/mvc";

class CustomMiddleware {
  use() {
  }
}

describe("UseAfter()", () => {
  describe("when the decorator is use on a class", () => {
    class Test {
      test() {
      }
    }

    before(() => {
      Sinon.stub(EndpointRegistry, "useAfter");
    });

    after(() => {
      // @ts-ignore
      EndpointRegistry.useAfter.restore();
    });

    afterEach(() => {
      // @ts-ignore
      EndpointRegistry.useAfter.resetHistory();
    });

    it("should add the middleware on the use stack", () => {
      // WHEN
      UseAfter(CustomMiddleware)(Test);

      // THEN
      Store.from(Test).get("middlewares").should.deep.eq({useAfter: [CustomMiddleware]});
    });
  });
  describe("when the decorator is use on a method", () => {
    before(() => {
      Sinon.stub(EndpointRegistry, "useAfter");
    });

    after(() => {
      // @ts-ignore
      EndpointRegistry.useAfter.restore();
    });

    afterEach(() => {
      // @ts-ignore
      EndpointRegistry.useAfter.resetHistory();
    });

    it("should add the middleware on the use stack", () => {
      // WHEN
      class Test {
        @UseAfter(CustomMiddleware)
        test() {
        }
      }

      // THEN
      EndpointRegistry.useAfter.should.be.calledWithExactly(prototypeOf(Test), "test", [CustomMiddleware]);
    });
  });
  describe("when the decorator is use in another way", () => {
    class Test {
      test() {
      }
    }

    before(() => {
      Sinon.stub(EndpointRegistry, "useAfter");
    });

    after(() => {
      // @ts-ignore
      EndpointRegistry.useAfter.restore();
    });

    afterEach(() => {
      // @ts-ignore
      EndpointRegistry.useAfter.resetHistory();
    });

    it("should add the middleware on the use stack", () => {
      // WHEN
      let actualError;
      try {
        UseAfter(CustomMiddleware)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
      actualError.message.should.eq("UseAfter cannot used as property.static decorator on Test.property");
    });
  });
});
