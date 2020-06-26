import {AcceptMimesMiddleware, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";

describe("AcceptMimesMiddleware", () => {
  describe("when success", () => {
    it(
      "should accept the type",
      PlatformTest.inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {
        const acceptStub = Sinon.stub();
        acceptStub.withArgs("application/xml").returns(true);
        acceptStub.withArgs("application/json").returns(false);

        const request = {
          accepts: acceptStub,
          ctx: {
            endpoint: {
              get: () => {
                return ["application/json", "application/xml"];
              }
            }
          }
        };

        // @ts-ignore
        const result = middleware.use(request);
        expect(result).to.equal(undefined);
        expect(request.accepts).to.have.been.calledWithExactly("application/json").and.calledWithExactly("application/xml");
      })
    );
  });

  describe("when error", () => {
    it(
      "should call request.accepts methods",
      PlatformTest.inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {
        const acceptStub = Sinon.stub();
        acceptStub.withArgs("application/xml").returns(false);
        acceptStub.withArgs("application/json").returns(false);

        const request = {
          accepts: acceptStub,
          ctx: {
            endpoint: {
              get: () => {
                return ["application/json", "application/xml"];
              }
            }
          }
        };
        let error: any;

        try {
          // @ts-ignore
          middleware.use(request);
        } catch (er) {
          error = er;
        }
        expect(error.message).to.equal("You must accept content-type application/json, application/xml");
      })
    );
  });
});
