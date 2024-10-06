import {Maximum, Minimum, Property} from "@tsed/schema";

import {getFormioSchema} from "../src/index.js";

describe("Number", () => {
  describe("number declaration", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Property()
        test: number;
      }

      const form = await getFormioSchema(Model);

      expect(form).toEqual({
        components: [
          {
            delimiter: false,
            disabled: false,
            input: true,
            inputFormat: "plain",
            key: "test",
            label: "Test",
            mask: false,
            requireDecimal: false,
            type: "number",
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
  describe("Minimum", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Minimum(10)
        test: number;
      }

      const form = await getFormioSchema(Model);

      expect(form).toEqual({
        components: [
          {
            delimiter: false,
            disabled: false,
            input: true,
            inputFormat: "plain",
            key: "test",
            label: "Test",
            mask: false,
            requireDecimal: false,
            type: "number",
            validate: {
              required: false,
              min: 10
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
  describe("Maximum", () => {
    it("should generate the correct schema", async () => {
      class Model {
        @Maximum(100)
        test: number;
      }

      const form = await getFormioSchema(Model);

      expect(form).toEqual({
        components: [
          {
            delimiter: false,
            disabled: false,
            input: true,
            inputFormat: "plain",
            key: "test",
            label: "Test",
            mask: false,
            requireDecimal: false,
            type: "number",
            validate: {
              required: false,
              max: 100
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
