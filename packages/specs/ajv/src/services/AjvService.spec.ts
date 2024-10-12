import {catchAsyncError} from "@tsed/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import {object, string} from "@tsed/schema";

import {AjvService} from "./AjvService.js";

describe("AjvService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should use the function api as schema", async () => {
    const ajvService = PlatformTest.get<AjvService>(AjvService);

    const error: any = await catchAsyncError(() => ajvService.validate("test", string().minLength(5)));
    expect(error.errors).toEqual([
      {
        data: "test",
        dataPath: "",
        instancePath: "",
        keyword: "minLength",
        message: "must NOT have fewer than 5 characters",
        params: {
          limit: 5
        },
        schemaPath: "#/minLength"
      }
    ]);
  });

  it("should use the function api as schema (required)", async () => {
    const ajvService = PlatformTest.get<AjvService>(AjvService);

    const error: any = await catchAsyncError(() => ajvService.validate({}, object({test: string().required()})));
    expect(error.errors).toEqual([
      {
        dataPath: ".test",
        instancePath: "",
        keyword: "required",
        message: "must have required property 'test'",
        params: {
          missingProperty: "test"
        },
        schemaPath: "#/required"
      }
    ]);
  });
});
