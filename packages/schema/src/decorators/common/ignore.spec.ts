import {getJsonSchema, Property} from "@tsed/schema";
import {expect} from "chai";
import {Ignore} from "./ignore";

describe("@Ignore", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Ignore()
      prop1: string;

      @Property()
      prop2: string;
    }

    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: "string"
        }
      },
      type: "object"
    });
  });

  it("should declare prop (boolean)", () => {
    // WHEN
    class Model {
      @Ignore(true)
      prop1: string;

      @Property()
      prop2: string;
    }

    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop2: {
          type: "string"
        }
      },
      type: "object"
    });
  });
});
