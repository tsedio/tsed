import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {ObjectID} from "./objectID";

describe("ObjectID", () => {
  it("should declare an ObjectID field", () => {
    class MyModelTest {
      @ObjectID("id")
      _id: string;
    }

    expect(getJsonSchema(MyModelTest)).to.deep.eq({
      properties: {
        id: {
          description: "Mongoose ObjectId",
          examples: ["5ce7ad3028890bd71749d477"],
          pattern: "^[0-9a-fA-F]{24}$",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
