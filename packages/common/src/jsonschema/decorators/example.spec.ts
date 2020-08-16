import {Example, getJsonSchema} from "@tsed/common";
import {expect} from "chai";
import {Property} from "./property";

describe("@Example", () => {
  it("should declare description on property", () => {
    // WHEN

    class Model {
      @Example("Examples")
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      definitions: {},
      properties: {
        method: {
          examples: ["Examples"],
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare description on property (with obj)", () => {
    // WHEN

    class Model {
      @Example({id: "id"})
      method: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      definitions: {},
      properties: {
        method: {
          examples: [
            {
              id: "id"
            }
          ],
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare description on property (with array)", () => {
    // WHEN

    class Model {
      @Example([{id: "id"}])
      method: any[];
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      definitions: {},
      properties: {
        method: {
          examples: [
            [
              {
                id: "id"
              }
            ]
          ],
          items: {
            type: "object"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
  it("should declare description on property (with two params on class)", () => {
    // WHEN

    @Example("method", "description")
    class Model {
      @Property()
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      definitions: {},
      example: {
        method: "description"
      },
      properties: {
        method: {
          type: "string"
        }
      },
      type: "object"
    });
  });
});
