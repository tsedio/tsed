import {AjvService} from "@tsed/ajv";
import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {string} from "@tsed/schema";
import {expect} from "chai";

describe("AjvService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should use the function api as schema", async () => {
    const ajvService = PlatformTest.get<AjvService>(AjvService);

    const error: any = await catchAsyncError(() => ajvService.validate("test", string().minLength(5)));
    expect(error.errors).to.deep.equal([
      {
        keyword: "minLength",
        dataPath: "",
        schemaPath: "#/minLength",
        params: {limit: 5},
        message: "should NOT have fewer than 5 characters",
        data: "test"
      }
    ]);
  });
});
