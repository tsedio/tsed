import {Nullable, Property, Required} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";

describe("@Nullable", () => {
  it("should declare any prop (Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null) // allow null
      @Nullable(String)
      prop2: string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: ["null", "string"],
          minLength: 1
        }
      },
      required: ["prop2"],
      type: "object"
    });
  });
  it("should declare any prop (String + Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null, "") // allow null
      @Nullable(String)
      prop2: string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: ["null", "string"]
        }
      },
      required: ["prop2"],
      type: "object"
    });
  });
  it("should declare any prop (String + Nullable)", () => {
    // WHEN
    class Model {
      @Nullable(String)
      prop2: string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: ["null", "string"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (String & Number + Nullable)", () => {
    // WHEN
    class Model {
      @Nullable(String, Number)
      prop2: number | string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: ["null", "string", "number"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (String & Number + Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null, "")
      @Nullable(String, Number)
      prop2: number | string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: ["null", "string", "number"]
        }
      },
      required: ["prop2"],
      type: "object"
    });
  });
  it("should declare any prop (Date + Nullable)", () => {
    // WHEN
    class Model {
      @Nullable(Date)
      prop2: Date | null;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: ["null", "string"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (Model + Nullable)", () => {
    // WHEN
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @Nullable(Nested)
      prop2: Nested | null;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      definitions: {
        Nested: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        prop2: {
          oneOf: [
            {
              type: "null"
            },
            {
              $ref: "#/definitions/Nested"
            }
          ]
        }
      },
      type: "object"
    });
  });
});
