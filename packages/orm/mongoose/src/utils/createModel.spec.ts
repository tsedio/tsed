import {Store} from "@tsed/core";
import mongoose from "mongoose";
import {createModel} from "../../src";
import {MONGOOSE_MODEL} from "../constants/constants";
import {DiscriminatorKey} from "../decorators/discriminatorKey";

describe("createModel()", () => {
  let schema: any;
  mongoose.model = jest.fn();
  describe("when the model name is given", () => {
    class Test {}

    beforeEach(() => {
      schema = {};
      createModel(Test, schema, "name", "collection", true);
    });

    it("should call mongoose.model", () => {
      expect(mongoose.model).toHaveBeenCalledWith("name", schema, "collection", {overwriteModels: true});
    });
  });

  describe("when the model name is not given", () => {
    class Test {}

    beforeEach(() => {
      schema = {};

      createModel(Test, schema);
    });

    it("should call mongoose.model", () => {
      expect(mongoose.model).toHaveBeenCalledWith("Test", schema, undefined, undefined);
    });
  });

  describe("when the model is derived and parent has no discriminator key", () => {
    class TestParent {}

    class TestChild extends TestParent {}

    beforeEach(() => {
      schema = {};
      createModel(TestChild, schema);
    });

    it("should call mongoose.model", () => {
      expect(mongoose.model).toHaveBeenCalledWith("TestChild", schema, undefined, undefined);
    });
  });

  describe("when the model is derived and parent has discriminator key", () => {
    class TestParent {
      @DiscriminatorKey()
      kind: string;
    }

    class TestChild extends TestParent {}

    let parentModel: any;

    beforeEach(() => {
      schema = {};
      parentModel = {discriminator: jest.fn()};
      Store.from(TestParent).set(MONGOOSE_MODEL, parentModel);

      createModel(TestChild, schema);
    });

    it("should call parentModel.discriminator with class name", () => {
      expect(parentModel.discriminator).toHaveBeenCalledWith("TestChild", schema);
    });
  });

  describe("when the derived model has custom discriminator value", () => {
    class TestParent {
      @DiscriminatorKey()
      kind: string;
    }

    class TestChild extends TestParent {}

    let parentModel: any;

    beforeEach(() => {
      schema = {};
      parentModel = {discriminator: jest.fn()};
      Store.from(TestParent).set(MONGOOSE_MODEL, parentModel);

      createModel(TestChild, schema, undefined, undefined, undefined, undefined, "test");
    });

    it("should call parentModel.discriminator with name from options", () => {
      expect(parentModel.discriminator).toHaveBeenCalledWith("test", schema);
    });
  });
});
