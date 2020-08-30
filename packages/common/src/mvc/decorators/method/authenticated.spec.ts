import {expect} from "chai";
import {AuthenticatedMiddleware} from "@tsed/common";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";

const middleware: any = Sinon.stub();
// tslint:disable-next-line:variable-name
const UseAuth: any = Sinon.stub().returns(middleware);

const {Authenticated} = Proxyquire.load("../../../../src/mvc/decorators/method/authenticated", {
  "./useAuth": {UseAuth},
});

describe("Authenticated", () => {
  describe("when the decorator is used on a method", () => {
    it("should set metadata", () => {
      // GIVEN

      // WHEN
      class Test {
        @Authenticated({options: "options"})
        test() {}
      }

      // THEN
      expect(UseAuth).to.have.been.calledWithExactly(AuthenticatedMiddleware, {
        options: "options",
        responses: {
          "401": {
            description: "Unauthorized",
          },
        },
      });
    });
  });
});
