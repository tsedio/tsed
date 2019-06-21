import {decoratorArgs} from "@tsed/core";
import * as Sinon from "sinon";
import {Store} from "../../../../../core/src";
import {prototypeOf, UnsupportedDecoratorType} from "../../../../../core/src/utils";
import {EndpointRegistry, UseAuth} from "../../../../src/mvc";

class Guard {
  use() {
  }
}

describe("UseAuth()", () => {
  describe("when the decorator is use on a method", () => {
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
  describe("when the decorator is use on a class and method", () => {
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

      @UseAuth(Guard, {defaultRole: "test"})
      class Test {
        @UseAuth(Guard, {role: "test2"})
        test() {
        }

        test2() {
        }
      }

      // THEN
      const storeTest = Store.from(...decoratorArgs(prototypeOf(Test), "test"));
      const storeTest2 = Store.from(...decoratorArgs(prototypeOf(Test), "test2"));

      EndpointRegistry.useBefore.should.be.calledWithExactly(prototypeOf(Test), "test", [Guard]);
      EndpointRegistry.useBefore.should.be.calledWithExactly(prototypeOf(Test), "test2", [Guard]);

      storeTest.get(Guard).should.deep.eq({role: "test2", defaultRole: "test"});
      storeTest2.get(Guard).should.deep.eq({defaultRole: "test"});
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
        UseAuth(Guard)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
      actualError.message.should.eq("UseAuth cannot used as property.static decorator on Test.property");
    });
  });
});
