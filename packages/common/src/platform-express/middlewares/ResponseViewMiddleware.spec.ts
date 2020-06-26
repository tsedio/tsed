import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {ResponseViewMiddleware} from "./ResponseViewMiddleware";

describe("ResponseViewMiddleware :", () => {
  describe("when header isn't sent", () => {
    it(
      "should have middleware",
      PlatformTest.inject([ResponseViewMiddleware], (middleware: ResponseViewMiddleware) => {
        const response = {
          status: () => {},
          render: Sinon.stub()
        };

        const endpoint = {
          store: {
            get: (type: any) => {
              return type === ResponseViewMiddleware
                ? {
                    viewPath: "page.html",
                    viewOptions: {test: "test"}
                  }
                : {test: "test"};
            }
          }
        };

        // @ts-ignore
        middleware.use({}, endpoint, response as any);

        expect(middleware).not.to.be.undefined;
        expect(response.render).to.have.been.calledWithExactly("page.html", {test: "test"}, Sinon.match.func);
      })
    );
  });

  describe("when header isn't sent but view path is wrong", () => {
    it(
      "should have middleware",
      PlatformTest.inject([ResponseViewMiddleware], (middleware: ResponseViewMiddleware) => {
        const response = {
          status: () => {},
          render: Sinon.stub()
        };

        const endpoint = {
          store: {
            get: (type: any) => {
              return type === ResponseViewMiddleware
                ? {
                    viewOptions: {test: "test"}
                  }
                : {test: "test"};
            }
          }
        };

        middleware.use({}, endpoint as any, response as any);

        expect(middleware).not.to.be.undefined;
        expect(response.render).to.not.be.called;
      })
    );
  });
});
