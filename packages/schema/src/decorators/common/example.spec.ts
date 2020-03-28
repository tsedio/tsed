import {descriptorOf} from "@tsed/core";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Example} from "./example";

describe("@Example", () => {
  it("should declare description on class", () => {
    // WHEN
    @Example({
      default: {id: "id"}
    })
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      examples: {
        default: {
          id: "id"
        }
      },
      type: "object"
    });
  });
  it("should declare description on property", () => {
    // WHEN

    class Model {
      @Example("Examples")
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        method: {
          examples: "Examples",
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should throw error when the decorator isn't used with a supported decorator type", () => {
    // WHEN
    let actualError: any;
    try {
      class Test {
        method() {}
      }

      Example("example")(Test.prototype, "method", descriptorOf(Test, "method"));
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.deep.equal("Example cannot be used as method decorator on Test.method");
  });
});
