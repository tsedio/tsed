import {expect} from "chai";
import {decoratorArgs} from "@tsed/core";
import * as Sinon from "sinon";
import {Store} from "../../../../../core/src";
import {prototypeOf, UnsupportedDecoratorType} from "../../../../../core/src/utils";
import {EndpointRegistry, UseAuth} from "../../../../src/mvc";

class Guard {
  use() {}
}

describe("UseAuth()", () => {
  describe("when the decorator is use on a method", () => {
    class Test {
      test() {}
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
            auth: ["email"]
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

      expect(EndpointRegistry.useBefore).to.have.been.calledWithExactly(prototypeOf(Test), "test", [Guard]);
      expect(store.get("operation")).to.deep.eq({
        security: [
          {
            auth: ["email"]
          }
        ]
      });
      expect(store.get("responses")).to.deep.eq({
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
      test() {}
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
            auth: ["email"]
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

      expect(EndpointRegistry.useBefore).to.have.been.calledWithExactly(prototypeOf(Test), "test", [Guard]);

      expect(store.get("operation")).to.deep.eq({
        security: [
          {
            auth: ["email"]
          }
        ]
      });
      expect(store.get("responses")).to.deep.eq({
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
        test() {}

        test2() {}
      }

      // THEN
      const storeTest = Store.from(...decoratorArgs(prototypeOf(Test), "test"));
      const storeTest2 = Store.from(...decoratorArgs(prototypeOf(Test), "test2"));

      expect(EndpointRegistry.useBefore).to.have.been.calledWithExactly(prototypeOf(Test), "test", [Guard]);
      expect(EndpointRegistry.useBefore).to.have.been.calledWithExactly(prototypeOf(Test), "test2", [Guard]);

      expect(storeTest.get(Guard)).to.deep.eq({role: "test2", defaultRole: "test"});
      expect(storeTest2.get(Guard)).to.deep.eq({defaultRole: "test"});
    });
  });
  describe("when the decorator is use in another way", () => {
    class Test {
      test() {}
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
      expect(actualError).to.be.instanceOf(UnsupportedDecoratorType);
      expect(actualError.message).to.eq("UseAuth cannot be used as property.static decorator on Test.property");
    });
  });
});
