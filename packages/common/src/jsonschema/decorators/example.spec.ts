import {Example} from "@tsed/common";
import {Property, getJsonSchema} from "@tsed/schema";
import {expect} from "chai";

describe("@Example", () => {
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
  it("should declare description on property (with obj)", () => {
    // WHEN

    class Model {
      @Example({id: "id"})
      method: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
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
      properties: {
        method: {
          examples: [
            [
              {
                id: "id"
              }
            ]
          ],
          type: "array"
        }
      },
      type: "object"
    });
  });
});
