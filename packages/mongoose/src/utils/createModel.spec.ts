import {Store} from "@tsed/core";
import {expect} from "chai";
import * as mongoose from "mongoose";
import * as Sinon from "sinon";
import {MONGOOSE_MODEL_NAME} from "../../src/constants";
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
      modelStub.should.have.been.calledWithExactly("name", schema, "collection", true);
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
      modelStub.should.have.been.calledWithExactly("Test", schema, undefined, undefined);
    });
  });
});
