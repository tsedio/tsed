import {EndpointMetadata, Redirect} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../../test/helper";

describe("Redirect", () => {
  describe("with one parameter", () => {
    it("should call redirect", () => {
      class Test {
        @Redirect("test")
        test() {
        }
      }

      const nextSpy = Sinon.stub();
      const response = new FakeResponse();
      const endpoint = EndpointMetadata.get(Test, "test");
      const middleware = endpoint.afterMiddlewares[0];

      Sinon.stub(response, "redirect");

      expect(middleware).to.be.a("function");

      middleware({}, response, nextSpy);

      expect(response.redirect).to.have.been.calledWithExactly("test", undefined);

      return expect(nextSpy).to.have.been.calledOnceWithExactly();
    });
  });
  describe("with two parameter", () => {
    it("should call redirect", () => {
      class Test {
        @Redirect(200, "test")
        test() {
        }
      }

      const nextSpy = Sinon.stub();
      const response = new FakeResponse();
      const endpoint = EndpointMetadata.get(Test, "test");
      const middleware = endpoint.afterMiddlewares[0];

      Sinon.stub(response, "redirect");

      expect(middleware).to.be.a("function");

      middleware({}, response, nextSpy);

      expect(response.redirect).to.have.been.calledWithExactly(200, "test");

      return expect(nextSpy).to.have.been.calledOnceWithExactly();
    });
  });
});
