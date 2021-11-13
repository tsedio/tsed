import {getJsonSchema} from "@tsed/schema";
import Ajv from "ajv";
import {expect} from "chai";
import {Allow} from "./allow";
import {Property} from "./property";
import {Required} from "./required";

describe("@Allow", () => {
  it("should declare required and allow field (without Allow)", () => {
    // WHEN
    class Model {
      @Required()
      allow: string;
    }

    // THEN
    const classSchema = getJsonSchema(Model);

    expect(classSchema).to.deep.equal({
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
    expect(validate({allow: ""})).to.equal(false);
    expect(validate({allow: 0})).to.equal(false);
    expect(validate({})).to.equal(false);
  });
  it("should declare required and allow field (with Allowed empty string)", () => {
    // WHEN
    class Model {
      @Allow("")
      allow: string;
    }

    // THEN
    const classSchema = getJsonSchema(Model);

    expect(classSchema).to.deep.equal({
      properties: {
        allow: {
          type: "string"
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema);
    expect(validate({allow: ""})).to.equal(true);
    expect(validate({})).to.equal(false);
  });
  it("should declare required and allow field (with Allowed null basic type)", () => {
    // WHEN
    class Model {
      @Allow(null)
      allow: string;
    }

    // THEN
    const classSchema = getJsonSchema(Model);

    expect(classSchema).to.deep.equal({
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
    expect(validate({allow: null})).to.equal(true);
    expect(validate({})).to.equal(false);
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

    expect(spec).to.deep.equal({
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
    expect(validate({allow: null})).to.equal(true);
    expect(validate({})).to.equal(false);
  });
});
