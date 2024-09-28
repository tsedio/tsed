import {Ajv} from "ajv";

import {validateModel} from "../../../test/helpers/validateModel.js";
import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {getJsonSchema, MinLength} from "../../index.js";
import {Property} from "../common/property.js";
import {Required} from "./required.js";

describe("@Required", () => {
  it("should declare required field", () => {
    // WHEN
    class Model {
      @Required()
      num: number;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          type: "number"
        }
      },
      required: ["num"],
      type: "object"
    });
  });
  it("should declare required field (false)", () => {
    // WHEN
    class Model {
      @Required(false)
      num: number;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should declare required field on string property", () => {
    // WHEN
    class Model {
      @Required()
      prop: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        prop: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["prop"],
      type: "object"
    });
  });
  it("should declare required field on string property (minLength 3)", () => {
    // WHEN
    class Model {
      @Required()
      @MinLength(3)
      prop: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        prop: {
          minLength: 3,
          type: "string"
        }
      },
      required: ["prop"],
      type: "object"
    });
  });
  it("should declare required field with a model an null", () => {
    // WHEN
    class NestedModel {
      @Property()
      prop: string;
    }

    class Model {
      @Required(true, null, NestedModel)
      allow: NestedModel | null;
    }

    // THEN
    const spec = getJsonSchema(Model);

    expect(spec).toEqual({
      definitions: {
        NestedModel: {
          properties: {
            prop: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        allow: {
          anyOf: [
            {
              type: "null"
            },
            {
              $ref: "#/definitions/NestedModel"
            }
          ]
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(spec);
    expect(validate({allow: null})).toBe(true);
    expect(validate({})).toBe(false);
  });
  it("should declare required field with custom error message", () => {
    // WHEN
    class Model {
      @(Required().Error("custom message"))
      num: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      errorMessage: {
        required: {
          num: "custom message"
        }
      },
      properties: {
        num: {
          type: "number"
        }
      },
      required: ["num"],
      type: "object"
    });

    const result = validateModel({}, Model);

    expect(result).toEqual([
      {
        instancePath: "",
        keyword: "errorMessage",
        message: "custom message",
        params: {
          errors: [
            {
              emUsed: true,
              instancePath: "",
              keyword: "required",
              message: "must have required property 'num'",
              params: {
                missingProperty: "num"
              },
              schemaPath: "#/required"
            }
          ]
        },
        schemaPath: "#/errorMessage"
      }
    ]);
  });
});
