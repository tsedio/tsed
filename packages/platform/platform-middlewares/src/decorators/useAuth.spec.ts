import {EndpointMetadata} from "@tsed/common";
import {decoratorArgs, prototypeOf, Store, UnsupportedDecoratorType} from "@tsed/core";
import {expect} from "chai";
import {UseAuth} from "./useAuth";

class Guard {
  use() {}
}

describe("UseAuth()", () => {
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      @UseAuth(Guard, {
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
      })
      class Test {
        test() {}
      }

      // THEN
      const args = decoratorArgs(prototypeOf(Test), "test");
      const store = Store.from(...args);
      // @ts-ignore
      const endpoint = EndpointMetadata.get(...args);

      expect(endpoint.beforeMiddlewares).to.deep.equal([Guard]);
      expect(store.get(Guard)).to.deep.eq({
        responses: {
          "200": {
            description: "Success"
          }
        },
        security: [
          {
            auth: ["email"]
          }
        ]
      });
    });
  });
  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      @UseAuth(Guard, {
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
      })
      class Test {
        test() {}
      }

      // THEN
      const args = decoratorArgs(prototypeOf(Test), "test");
      const store = Store.from(...args);
      // @ts-ignore
      const endpoint = EndpointMetadata.get(...args);

      expect(endpoint.beforeMiddlewares).to.deep.equal([Guard]);

      expect(store.get(Guard)).to.deep.eq({
        responses: {
          "200": {
            description: "Success"
          }
        },
        security: [
          {
            auth: ["email"]
          }
        ]
      });
    });
  });
  describe("when the decorator is use on a class and method", () => {
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
      // @ts-ignore
      const endpoint = EndpointMetadata.get(Test, "test");
      expect(endpoint.beforeMiddlewares).to.deep.equal([Guard]);

      const endpoint2 = EndpointMetadata.get(Test, "test2");
      expect(endpoint2.beforeMiddlewares).to.deep.equal([Guard]);

      expect(storeTest.get(Guard)).to.deep.eq({role: "test2", defaultRole: "test"});
      expect(storeTest2.get(Guard)).to.deep.eq({defaultRole: "test"});
    });
  });
  describe("when the decorator is use in another way", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      let actualError;
      try {
        class Test {}

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
