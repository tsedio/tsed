import {Nullable, Required} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";

describe("@Nullable", () => {
  it("should declare any prop", () => {
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
          type: ["null", "string"]
        }
      },
      required: ["prop2"],
      type: "object"
    });
  });
  it("should declare any prop with types", () => {
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

  it("should declare any prop with Date", () => {
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
});
