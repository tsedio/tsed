import {Store} from "@tsed/core";
import {expect} from "chai";
import * as mongoose from "mongoose";
import * as Sinon from "sinon";
import {MONGOOSE_MODEL_NAME} from "../../src/constants";
import {createModel} from "../../src/utils";

describe("createModel()", () => {
  describe("when the model name is given", () => {
    class Test {
    }

    before(() => {
      this.schema = {
        loadClass: Sinon.stub()
      };

      this.modelStub = Sinon.stub(mongoose, "model");

      this.converterStub = {
        serializeClass: Sinon.stub()
      };

      createModel(Test, this.schema, "name", "collection", true);

      this.instance = new Test();
      this.instance.serialize({
        checkRequiredValue: "checkRequiredValue",
        ignoreCallback: "ignoreCallback"
      }, this.converterStub);
    });

    after(() => {
      this.modelStub.restore();
    });

    it("should store the model name", () => {
      expect(Store.from(Test).get(MONGOOSE_MODEL_NAME)).to.equals("name");
    });

    it("should call loadClass", () => {
      this.schema.loadClass.should.have.been.calledWithExactly(Test);
    });

    it("should call mongoose.model", () => {
      this.modelStub.should.have.been.calledWithExactly("name", this.schema, "collection", true);
    });

    it("should converter.serializeClass", () => {
      this.converterStub.serializeClass.should.have.been.calledWithExactly(this.instance, {
        type: Test,
        checkRequiredValue: "checkRequiredValue",
        ignoreCallback: "ignoreCallback"
      });
    });
  });
  describe("when the model name is not given", () => {
    class Test {
    }

    before(() => {
      this.schema = {
        loadClass: Sinon.stub()
      };

      this.modelStub = Sinon.stub(mongoose, "model");

      this.converterStub = {
        serializeClass: Sinon.stub()
      };

      createModel(Test, this.schema);

      this.instance = new Test();
      this.instance.serialize({
        checkRequiredValue: "checkRequiredValue",
        ignoreCallback: "ignoreCallback"
      }, this.converterStub);
    });

    after(() => {
      this.modelStub.restore();
    });

    it("should store the model name", () => {
      expect(Store.from(Test).get(MONGOOSE_MODEL_NAME)).to.equals("Test");
    });

    it("should call loadClass", () => {
      this.schema.loadClass.should.have.been.calledWithExactly(Test);
    });

    it("should call mongoose.model", () => {
      this.modelStub.should.have.been.calledWithExactly("Test", this.schema, undefined, undefined);
    });

    it("should converter.serializeClass", () => {
      this.converterStub.serializeClass.should.have.been.calledWithExactly(this.instance, {
        type: Test,
        checkRequiredValue: "checkRequiredValue",
        ignoreCallback: "ignoreCallback"
      });
    });
  });
});
