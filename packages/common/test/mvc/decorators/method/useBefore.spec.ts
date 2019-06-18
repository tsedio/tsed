import {prototypeOf, Store, UnsupportedDecoratorType} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointRegistry, UseBefore} from "../../../../src/mvc";

class CustomMiddleware {
  use() {
  }
}

describe("UseBefore()", () => {
  describe("when the decorator is use on a class", () => {
    class Test {
      test() {
      }
    }

    before(() => {
      Sinon.stub(EndpointRegistry, "useBefore");
    });

    after(() => {
      // @ts-ignore
      EndpointRegistry.useBefore.restore();
    });

    afterEach(() => {
      // @ts-ignore
      EndpointRegistry.useBefore.resetHistory();
    });

    it("should add the middleware on the use stack", () => {
      // WHEN
      UseBefore(CustomMiddleware)(Test);

      // THEN
      Store.from(Test).get("middlewares").should.deep.eq({useBefore: [CustomMiddleware]});
    });
  });
  describe("when the decorator is use on a method", () => {
    before(() => {
      Sinon.stub(EndpointRegistry, "useBefore");
    });

    after(() => {
      // @ts-ignore
      EndpointRegistry.useBefore.restore();
    });

    afterEach(() => {
      // @ts-ignore
      EndpointRegistry.useBefore.resetHistory();
    });

    it("should add the middleware on the use stack", () => {
      // WHEN
      class Test {
        @UseBefore(CustomMiddleware)
        test() {
        }
      }

      // THEN
      EndpointRegistry.useBefore.should.be.calledWithExactly(prototypeOf(Test), "test", [CustomMiddleware]);
    });
  });
  describe("when the decorator is use in another way", () => {
    class Test {
      test() {
      }
    }

    before(() => {
      Sinon.stub(EndpointRegistry, "useBefore");
    });

    after(() => {
      // @ts-ignore
      EndpointRegistry.useBefore.restore();
    });

    afterEach(() => {
      // @ts-ignore
      EndpointRegistry.useBefore.resetHistory();
    });

    it("should add the middleware on the use stack", () => {
      // WHEN
      let actualError;
      try {
        UseBefore(CustomMiddleware)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
      actualError.message.should.eq("UseBefore cannot used as property.static decorator on Test.property");
    });
  });
});
