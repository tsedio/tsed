import {MinLength, Required} from "@tsed/schema";

import {getFormioSchema} from "../src/index.js";

describe("Required", () => {
  describe("String", () => {
    it("should set required validation", async () => {
      class Model {
        @Required()
        test: string;
      }

      const form = await getFormioSchema(Model);

      expect(form).toEqual({
        components: [
          {
            disabled: false,
            input: true,
            key: "test",
            label: "Test",
            type: "textfield",
            validate: {
              required: true
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
    it("should not set required validation", async () => {
      class Model {
        @Required()
        @MinLength(0)
        test: string;
      }

      const form = await getFormioSchema(Model);

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
  describe("Boolean", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Required()
        test: boolean;
      }

      const form = await getFormioSchema(Model);

      expect(form).toEqual({
        components: [
          {
            disabled: false,
            input: true,
            key: "test",
            label: "Test",
            type: "checkbox",
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
});
