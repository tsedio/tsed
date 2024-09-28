import {Ajv} from "ajv";

import {getJsonSchema} from "../../index.js";
import {Allow} from "./allow.js";
import {Property} from "./property.js";
import {Required} from "./required.js";

describe("@Allow", () => {
  it("should declare required and allow field (without Allow)", () => {
    // WHEN
    class Model {
      @Required()
      allow: string;
    }

    // THEN
    const classSchema = getJsonSchema(Model);

    expect(classSchema).toEqual({
      properties: {
        allow: {
          type: "string",
          minLength: 1
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema);
    expect(validate({allow: ""})).toBe(false);
    expect(validate({allow: 0})).toBe(false);
    expect(validate({})).toBe(false);
  });
  it("should declare required and allow field (with Allowed empty string)", () => {
    // WHEN
    class Model {
      @Allow("")
      allow: string;
    }

    // THEN
    const classSchema = getJsonSchema(Model);

    expect(classSchema).toEqual({
      properties: {
        allow: {
          type: "string"
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema);
    expect(validate({allow: ""})).toBe(true);
    expect(validate({})).toBe(false);
  });
  it("should declare required and allow field (with Allowed null basic type)", () => {
    // WHEN
    class Model {
      @Allow(null)
      allow: string;
    }

    // THEN
    const classSchema = getJsonSchema(Model);

    expect(classSchema).toEqual({
      properties: {
        allow: {
          minLength: 1,
          type: ["null", "string"]
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema);
    expect(validate({allow: null})).toBe(true);
    expect(validate({})).toBe(false);
  });
  it("should declare required and allow field (with Allowed null NestedModel)", () => {
    // WHEN
    class NestedModel {
      @Property()
      prop: string;
    }

    class Model {
      @Allow(null, NestedModel)
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
});
