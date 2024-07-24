import {CollectionOf, Schema, array, map, string} from "@tsed/schema";
import {deserialize} from "@tsed/json-mapper";

describe("Collection of Map", () => {
  it("should declare an array of map of string", () => {
    const schema = array().items(map().additionalProperties(string()));

    class Test {
      @Schema(schema)
      @CollectionOf(Map)
      fields: Map<string, string>[] = [];
    }

    const result = deserialize(
      {
        fields: [
          {
            test: "test"
          }
        ]
      },
      {
        type: Test
      }
    );

    expect(result).toEqual({
      fields: [new Map([["test", "test"]])]
    });
  });
});
