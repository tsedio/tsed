import * as mod from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {ValidationErrorMiddleware} from "../../src/middlewares/ValidationErrorMiddleware";

describe("ValidationErrorMiddleware", () => {
  describe("when success", () => {
    class MongooseError {
    }

    it("should cast error", () => {
      const error = new MongooseError();
      const middleware = new ValidationErrorMiddleware();

      // WHEN
      let actualError: any;
      try {
        middleware.use(error);
      } catch (er) {
        actualError = er;
      }

      expect(actualError.name).to.equal("BAD_REQUEST");
    });
  });

  describe("when error", () => {
    it("should cast error", () => {
      const error = new Error();
      const middleware = new ValidationErrorMiddleware();

      // WHEN
      let actualError: any;
      try {
        middleware.use(error);
      } catch (er) {
        actualError = er;
      }

      expect(actualError.name).to.equal("Error");
    });
  });
});
