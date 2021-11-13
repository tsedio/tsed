import {getJsonSchema} from "@tsed/schema";
import Ajv from "ajv";
import {expect} from "chai";
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

    expect(classSchema.schema.toJSON()).to.deep.equal({
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

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
