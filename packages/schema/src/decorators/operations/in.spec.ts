import {getSpec, In, JsonSchemaStore, Name, SpecTypes} from "@tsed/schema";
import {expect} from "chai";

describe("In", () => {
  it("should declare all schema correctly", async () => {
    // WHEN
    class Controller {
      method(@In("path") @Name("basic") basic: string) {}
    }

    // THEN
    getSpec(Controller, {
      spec: SpecTypes.SWAGGER
    });

    const paramSchema = JsonSchemaStore.from(Controller, "method", 0);
    const methodSchema = paramSchema.parent;
    const operation = methodSchema.operation!.toJSON();

    expect(operation).to.deep.equal({
      parameters: [
        {
          in: "path",
          name: "basic",
          required: true,
          type: "string"
        }
      ],
      responses: {
        "200": {
          description: ""
        }
      }
    });
  });
  it("should throw error for unsupported usage", () => {
    class Test {
      test() {}
    }

    let actualError: any;
    try {
      In("tags")(Test.prototype, "test");
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.deep.eq("In cannot be used as property decorator on Test.test");
  });
});
