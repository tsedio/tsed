import {descriptorOf} from "@tsed/core";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Example} from "./example";

describe("@Example", () => {
  it("should declare description on class", () => {
    // WHEN
    @Example({id: "id"})
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      examples: [
        {
          id: "id"
        }
      ],
      type: "object"
    });
  });
  it("should declare description on class with description", () => {
    // WHEN
    @Example({id: "id"})
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      examples: [{id: "id"}],
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
          examples: ["Examples"],
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

      Example("example")(Test, "method", descriptorOf(Test, "method"));
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.deep.equal("Example cannot be used as method.static decorator on Test.method");
  });
});
