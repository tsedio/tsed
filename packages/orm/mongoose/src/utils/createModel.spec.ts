import {Store} from "@tsed/core";
import {expect} from "chai";
import mongoose from "mongoose";
import Sinon from "sinon";
import {createModel} from "../../src/utils";
import {MONGOOSE_MODEL, MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA_OPTIONS} from "../constants";
import {Model} from "../decorators";
import {DiscriminatorKey} from "../decorators/discriminatorKey";

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

  describe("when the model is derived and parent has no discriminator key", () => {
    class TestParent {}
    class TestChild extends TestParent {}

    before(() => {
      schema = {};
      modelStub = Sinon.stub(mongoose, "model");

      createModel(TestChild, schema);
    });

    after(() => {
      modelStub.restore();
    });

    it("should call mongoose.model", () => {
      expect(modelStub).to.have.been.calledWithExactly("TestChild", schema, undefined, undefined);
    });
  });

  describe("when the model is derived and parent has discriminator key", () => {
    class TestParent {
      @DiscriminatorKey()
      kind: string;
    }
    class TestChild extends TestParent {}

    let parentModel: any;

    before(() => {
      schema = {};
      parentModel = {discriminator: Sinon.spy()};
      Store.from(TestParent).set(MONGOOSE_MODEL, parentModel);

      createModel(TestChild, schema);
    });

    after(() => {
      modelStub.restore();
    });

    it("should call parentModel.discriminator with class name", () => {
      expect(parentModel.discriminator).to.have.been.calledWithExactly("TestChild", schema);
    });
  });

  describe("when the derived model has custom discriminator value", () => {
    class TestParent {
      @DiscriminatorKey()
      kind: string;
    }
    class TestChild extends TestParent {}

    let parentModel: any;

    before(() => {
      schema = {};
      parentModel = {discriminator: Sinon.spy()};
      Store.from(TestParent).set(MONGOOSE_MODEL, parentModel);

      createModel(TestChild, schema, undefined, undefined, undefined, undefined, "test");
    });

    after(() => {
      modelStub.restore();
    });

    it("should call parentModel.discriminator with name from options", () => {
      expect(parentModel.discriminator).to.have.been.calledWithExactly("test", schema);
    });
  });
});
