import {PlatformTest} from "@tsed/common";
import Ajv from "ajv";
import {expect} from "chai";

describe("Ajv", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a new Ajv instance", async () => {
    const ajv = await PlatformTest.invoke<Ajv>(Ajv);

    expect(ajv).to.instanceof(Ajv);
    expect(
      ajv.validate(
        {
          type: "object"
        },
        {}
      )
    ).to.equal(true);

    ajv.validate(
      {
        type: "object"
      },
      []
    );

    expect(ajv.errors).to.deep.equal([
      {
        dataPath: "",
        keyword: "type",
        message: "should be object",
        params: {
          type: "object"
        },
        schemaPath: "#/type"
      }
    ]);
  });
});
