import {expect} from "chai";
import mongoose from "mongoose";
import Sinon from "sinon";
import {createModel} from "../../src/utils";

describe("createModel()", () => {
  let schema: any, modelStub: any;
  describe("when the model name is given", () => {
    class Test {}

    before(() => {
      schema = {};
      modelStub = Sinon.stub(mongoose, "model");

      createModel(Test, schema, "name", "collection", true);
    });

    after(() => {
      modelStub.restore();
    });

    it("should call mongoose.model", () => {
      expect(modelStub).to.have.been.calledWithExactly("name", schema, "collection", true);
    });
  });

  describe("when the model name is not given", () => {
    class Test {}

    before(() => {
      schema = {};
      modelStub = Sinon.stub(mongoose, "model");

      createModel(Test, schema);
    });

    after(() => {
      modelStub.restore();
    });

    it("should call mongoose.model", () => {
      expect(modelStub).to.have.been.calledWithExactly("Test", schema, undefined, undefined);
    });
  });
});
