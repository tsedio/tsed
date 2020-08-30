import {getSpec, In, JsonEntityStore, Name, SpecTypes} from "@tsed/schema";
import {expect} from "chai";

describe("In", () => {
  it("should declare all schema correctly (param)", async () => {
    // WHEN
    class Controller {
      method(@In("path") @Name("basic") basic: string) {}
    }

    // THEN
    getSpec(Controller, {
      spec: SpecTypes.SWAGGER,
    });

    const paramSchema = JsonEntityStore.from(Controller, "method", 0);
    const methodSchema = paramSchema.parent;
    const operation = methodSchema.operation!.toJSON();

    expect(operation).to.deep.equal({
      parameters: [
        {
          in: "path",
          name: "basic",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "Success",
        },
      },
    });
  });
  it("should declare all schema correctly (method)", async () => {
    // WHEN
    class Controller {
      @(In("header").Type(String).Name("Authorization").Required().Description("description"))
      method(@In("path") @Name("basic") basic: string) {}
    }

    // THEN
    getSpec(Controller, {
      spec: SpecTypes.SWAGGER,
    });

    const paramSchema = JsonEntityStore.from(Controller, "method", 0);
    const methodSchema = paramSchema.parent;
    const operation = methodSchema.operation!.toJSON();

    expect(operation).to.deep.equal({
      parameters: [
        {
          in: "path",
          name: "basic",
          required: true,
          type: "string",
        },
        {
          in: "header",
          name: "Authorization",
          required: true,
          type: "string",
          description: "description",
        },
      ],
      responses: {
        "200": {
          description: "Success",
        },
      },
    });
  });
  it("should throw error for unsupported usage", () => {
    class Test {
      test() {}
    }

    let actualError: any;
    try {
      // @ts-ignore
      In("tags")(Test.prototype, "test");
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.deep.eq("In cannot be used as property decorator on Test.test");
  });
});
