import {getJsonSchema} from "@tsed/schema";
import Ajv from "ajv";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {Required} from "./required";
import {Property} from "../common/property";

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
          oneOf: [
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
      @Required().Error("custom message")
      num: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      properties: {
        num: {
          type: "number"
        }
      },
      required: ["num"],
      type: "object",
      errorMessage: {
        required: "custom message"
      }
    });
  });
});
