import {Controller} from "@tsed/common";
import {Consumes, getSpec, OperationPath} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Name} from "./name";

describe("@Name", () => {
  it("should declare name as alias (props)", () => {
    // WHEN
    class Model {
      @Name("num2")
      num: number;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num2: {
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should declare name on class", () => {
    // WHEN
    @Controller("/")
    @Name("AwesomeController")
    class MyController {
      @OperationPath("POST", "/")
      @Consumes("text/json")
      get() {}
    }

    // THEN
    expect(getSpec(MyController)).to.deep.equal({
      tags: [
        {
          name: "AwesomeController"
        }
      ],
      paths: {
        "/": {
          post: {
            consumes: ["text/json"],
            operationId: "awesomeControllerGet",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["AwesomeController"]
          }
        }
      }
    });
  });
});
