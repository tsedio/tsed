import {PlatformTest} from "@tsed/platform-http/testing";
import {Ajv} from "ajv";

describe("Ajv", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a new Ajv instance", async () => {
    const ajv = await PlatformTest.invoke<Ajv>(Ajv);

    expect(ajv).toBeInstanceOf(Ajv);
    expect(
      ajv.validate(
        {
          type: "object"
        },
        {}
      )
    ).toEqual(true);

    ajv.validate(
      {
        type: "object"
      },
      []
    );

    expect(ajv.errors).toEqual([
      {
        instancePath: "",
        keyword: "type",
        message: "must be object",
        params: {
          type: "object"
        },
        schemaPath: "#/type"
      }
    ]);
  });
});
