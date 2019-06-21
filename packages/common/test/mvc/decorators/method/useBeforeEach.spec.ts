import {prototypeOf, UnsupportedDecoratorType} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointRegistry, UseBeforeEach} from "../../../../src/mvc";

class CustomMiddleware {
  use() {
  }
}

describe("UseBeforeEach()", () => {
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
      UseBeforeEach(CustomMiddleware)(Test);

      // THEN
      EndpointRegistry.useBefore.should.be.calledWithExactly(prototypeOf(Test), "test", [CustomMiddleware]);
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
        @UseBeforeEach(CustomMiddleware)
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
        UseBeforeEach(CustomMiddleware)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
      actualError.message.should.eq("UseBeforeEach cannot used as property.static decorator on Test.property");
    });
  });
});
