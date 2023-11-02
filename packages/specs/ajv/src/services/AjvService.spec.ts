import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {string} from "@tsed/schema";
import {AjvService} from "./AjvService";

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
});
