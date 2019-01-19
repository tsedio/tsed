import {Store} from "@tsed/core";
import {expect} from "chai";
import * as mongoose from "mongoose";
import * as Sinon from "sinon";
import {MONGOOSE_MODEL_NAME} from "../../src/constants";
import {createModel} from "../../src/utils";

describe("createModel()", () => {
  describe("when the model name is given", () => {
    class Test {}

    before(() => {
      this.schema = {};
      this.modelStub = Sinon.stub(mongoose, "model");

      createModel(Test, this.schema, "name", "collection", true);
    });

    after(() => {
      this.modelStub.restore();
    });

    it("should store the model name", () => {
      expect(Store.from(Test).get(MONGOOSE_MODEL_NAME)).to.equals("name");
    });

    it("should call mongoose.model", () => {
      this.modelStub.should.have.been.calledWithExactly("name", this.schema, "collection", true);
    });
  });

  describe("when the model name is not given", () => {
    class Test {
    }

    before(() => {
      this.schema = {}
      this.modelStub = Sinon.stub(mongoose, "model");

      createModel(Test, this.schema);
    });

    after(() => {
      this.modelStub.restore();
    });

    it("should store the model name", () => {
      expect(Store.from(Test).get(MONGOOSE_MODEL_NAME)).to.equals("Test");
    });

    it("should call mongoose.model", () => {
      this.modelStub.should.have.been.calledWithExactly("Test", this.schema, undefined, undefined);
    });
  });
});
