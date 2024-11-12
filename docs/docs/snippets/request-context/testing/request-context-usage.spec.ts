import {inject, runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {CustomRepository} from "./CustomRepository";

describe("CustomRepository", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should run method with the ctx", async () => {
    const ctx = PlatformTest.createRequestContext();
    const service = inject(CustomRepository);

    ctx.request.headers = {
      "x-api": "api"
    };

    const result = await runInContext(ctx, () => service.findById("id"));

    expect(result).toEqual({
      id: "id",
      headers: {
        "x-api": "api"
      }
    });
  });
});
