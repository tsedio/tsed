import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {AuthenticatedMiddleware} from "../../../../src/mvc";

const middleware: any = Sinon.stub();
const UseAuth: any = Sinon.stub().returns(middleware);

const {Authenticated} = Proxyquire.load("../../../../src/mvc/decorators/method/authenticated", {
  "./useAuth": {UseAuth}
});


describe("Authenticated", () => {
  describe("when the decorator is used on a method", () => {
    it("should set metadata", () => {
      // GIVEN

      // WHEN
      class Test {
        @Authenticated({options: "options"})
        test() {
        }
      }

      // THEN
      UseAuth.should.be.calledWithExactly(AuthenticatedMiddleware, {
        options: "options",
        "responses": {
          "401": {
            "description": "Unauthorized"
          }
        }
      });
    });
  });
});
