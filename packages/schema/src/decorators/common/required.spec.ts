import {expect} from "chai";
import {JsonSchemaStore} from "../../domain/JsonSchemaStore";
import {Required} from "./required";

describe("@Required", () => {
  it("should declare required field", () => {
    // WHEN
    class Model {
      @Required()
      num: number;
    }

    // THEN
    const classSchema = JsonSchemaStore.from(Model);

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
    const classSchema = JsonSchemaStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should throw error when the decorator isn't used with a supported decorator type", () => {
    // WHEN
    let actualError: any;
    try {
      class Model {
        constructor(@Required(false) param: string) {}
      }
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.deep.equal("Required cannot be used as parameter.constructor decorator on Model");
  });
});
