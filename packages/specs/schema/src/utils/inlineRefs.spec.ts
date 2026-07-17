import {inlineRefs} from "./inlineRefs.js";

describe("inlineRefs", () => {
  it("should resolve escaped JSON Pointer segments", () => {
    expect(
      inlineRefs({
        definitions: {
          "a/b~c": {
            type: "string"
          }
        },
        properties: {
          value: {
            $ref: "#/definitions/a~1b~0c"
          }
        }
      })
    ).toMatchObject({
      properties: {
        value: {
          type: "string"
        }
      }
    });
  });

  it("should preserve external references", () => {
    expect(inlineRefs({$ref: "https://example.test/schema.json"})).toEqual({$ref: "https://example.test/schema.json"});
  });
});
