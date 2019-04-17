import {decoratorArgs} from "@tsed/core";
import * as Sinon from "sinon";
import {Store} from "../../../../../core/src";
import {prototypeOf, UnsupportedDecoratorType} from "../../../../../core/src/utils";
import {EndpointRegistry, UseAuth} from "../../../../src/mvc";

class Guard {
  use() {
  }
}

class Test {
  test() {
  }
}

describe("UseAuth()", () => {
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
      UseAuth(Guard, {
        security: [
          {
            "auth": ["email"]
          }
        ],
        responses: {
          "200": {
            description: "Success"
          }
        }
      })(...decoratorArgs(prototypeOf(Test), "test"));

      // THEN
      const store = Store.from(...decoratorArgs(prototypeOf(Test), "test"));

      EndpointRegistry.useBefore.should.be.calledWithExactly(prototypeOf(Test), "test", [Guard]);
      store.get("operation").should.deep.eq({
        security: [
          {
            "auth": ["email"]
          }
        ]
      });
      store.get("responses").should.deep.eq({
        "200": {
          description: "Success"
        }
      });
      store.set("operation", {});
      store.set("responses", {});
    });
  });
  describe("when the decorator is use on a class", () => {
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
      UseAuth(Guard, {
        security: [
          {
            "auth": ["email"]
          }
        ],
        responses: {
          "200": {
            description: "Success"
          }
        }
      })(Test);

      // THEN
      const store = Store.from(...decoratorArgs(prototypeOf(Test), "test"));

      EndpointRegistry.useBefore.should.be.calledWithExactly(prototypeOf(Test), "test", [Guard]);
      store.get("operation").should.deep.eq({
        security: [
          {
            "auth": ["email"]
          }
        ]
      });
      store.get("responses").should.deep.eq({
        "200": {
          description: "Success"
        }
      });

      store.set("operation", {});
      store.set("responses", {});
    });
  });

  describe("when the decorator is use in another way", () => {
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
        UseAuth(Guard)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
      actualError.message.should.eq("UseAuth cannot used as property.static at Test.property");
    });
  });
});
