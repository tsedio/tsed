import {getJsonSchema, Property} from "@tsed/schema";
import {expect} from "chai";
import {Ignore} from "./ignoreProperty";

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
});
