import {MaxLength, MinLength, Pattern, Property} from "@tsed/schema";

import {getFormioSchema} from "../src/index.js";

describe("String", () => {
  describe("string declaration", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Property()
        test: string;
      }

      const form = await getFormioSchema(Model, {groups: ["group1"]});

      expect(form).toEqual({
        components: [
          {
            disabled: false,
            input: true,
            key: "test",
            label: "Test",
            type: "textfield",
            validate: {
              required: false
            }
          }
        ],
        display: "form",
        machineName: "model",
        name: "model",
        title: "Model",
        type: "form",
        submissionAccess: [],
        access: [],
        tags: []
      });
    });
  });
  describe("Pattern", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Property()
        @Pattern(/(\d{12})\.(\w+)\.api\.com/)
        test: string;
      }

      const form = await getFormioSchema(Model, {groups: ["group1"]});

      expect(form).toEqual({
        components: [
          {
            disabled: false,
            input: true,
            key: "test",
            label: "Test",
            type: "textfield",
            validate: {
              required: false,
              pattern: "(\\d{12})\\.(\\w+)\\.api\\.com"
            }
          }
        ],
        display: "form",
        machineName: "model",
        name: "model",
        title: "Model",
        type: "form",
        submissionAccess: [],
        access: [],
        tags: []
      });
    });
  });
  describe("MinLength", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Property()
        @MinLength(10)
        test: string;
      }

      const form = await getFormioSchema(Model, {groups: ["group1"]});

      expect(form).toEqual({
        components: [
          {
            disabled: false,
            input: true,
            key: "test",
            label: "Test",
            type: "textfield",
            validate: {
              required: false,
              minLength: 10
            }
          }
        ],
        display: "form",
        machineName: "model",
        name: "model",
        title: "Model",
        type: "form",
        submissionAccess: [],
        access: [],
        tags: []
      });
    });
  });
  describe("MaxLength", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Property()
        @MaxLength(100)
        test: string;
      }

      const form = await getFormioSchema(Model, {groups: ["group1"]});

      expect(form).toEqual({
        components: [
          {
            disabled: false,
            input: true,
            key: "test",
            label: "Test",
            type: "textfield",
            validate: {
              required: false,
              maxLength: 100
            }
          }
        ],
        display: "form",
        machineName: "model",
        name: "model",
        title: "Model",
        type: "form",
        submissionAccess: [],
        access: [],
        tags: []
      });
    });
  });
});
