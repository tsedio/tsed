import * as mod from "../../../../src/core/utils";
import {ValidationErrorMiddleware} from "../../../../src/mongoose/middlewares/ValidationErrorMiddleware";
import {expect, Sinon} from "../../../tools";

describe("ValidationErrorMiddleware", () => {
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
