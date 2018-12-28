import * as mod from "@tsed/core";
import {ValidationErrorMiddleware} from "../../../../packages/mongoose/src/middlewares/ValidationErrorMiddleware";
import {expect, Sinon} from "../../../tools";

describe("ValidationErrorMiddleware", () => {
  describe("when success", () => {
    class MongooseError {}

    before(() => {
      const error = new MongooseError();
      this.nameOfStub = Sinon.stub(mod, "nameOf").returns("MongooseError");
      this.nextStub = Sinon.stub();
      this.middleware = new ValidationErrorMiddleware();
      try {
        this.middleware.use(error, this.nextStub);
      } catch (er) {
        this.error = er;
      }
    });

    after(() => {
      this.nameOfStub.restore();
    });

    it("should cast error", () => {
      expect(this.error.name).to.equal("BAD_REQUEST");
    });
  });

  describe("when error", () => {
    before(() => {
      this.error = new Error();
      this.nameOfStub = Sinon.stub(mod, "nameOf").returns("Error");
      this.nextStub = Sinon.stub();
      this.middleware = new ValidationErrorMiddleware();
      this.middleware.use(this.error, this.nextStub);
    });

    after(() => {
      this.nameOfStub.restore();
    });

    it("should call next()", () => {
      this.nextStub.should.have.been.calledWithExactly(this.error);
    });
  });
});
