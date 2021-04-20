import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Any} from "../../../src/jsonschema";

describe("Any", () => {
  it("should declare any prop", () => {
    // WHEN
    class Model {
      @Any()
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop: {
          type: ["null", "integer", "number", "string", "boolean", "array", "object"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (uniq type)", () => {
    // WHEN
    class Model {
      @Any(String)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop: {
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (with list)", () => {
    // WHEN
    class Model {
      @Any(String, Number, Boolean, null)
      num: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          type: ["null", "string", "number", "boolean"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (with string, list)", () => {
    // WHEN
    class Model {
      @Any("string", "null")
      num: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          type: ["null", "string"]
        }
      },
      type: "object"
    });
  });
});
