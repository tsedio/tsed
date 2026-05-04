import {compile} from "@tsed/schema";

import {ObjectID} from "./objectID.js";

describe("ObjectID", () => {
  it("should declare an ObjectID field", () => {
    class MyModelTest {
      @ObjectID("id")
      _id: string;
    }

    expect(compile(MyModelTest)).toEqual({
      properties: {
        id: {
          description: "An ObjectID",
          examples: ["5ce7ad3028890bd71749d477"],
          pattern: "^[0-9a-fA-F]{24}$",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
