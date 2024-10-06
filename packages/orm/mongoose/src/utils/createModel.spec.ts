import mongoose from "mongoose";

import {createModel} from "../../src/index.js";

describe("createModel()", () => {
  let schema: any;
  mongoose.model = vi.fn();
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
});
