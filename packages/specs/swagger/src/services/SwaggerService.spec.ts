import {PlatformTest} from "@tsed/platform-http/testing";

import {SwaggerService} from "../index.js";

describe("SwaggerService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getOpenAPISpec()", () => {
    it("should compile spec only once time", async () => {
      const swaggerService = await PlatformTest.invoke<SwaggerService>(SwaggerService);
      const result1 = await swaggerService.getOpenAPISpec({specVersion: "3.0.1"} as any);
      const result2 = await swaggerService.getOpenAPISpec({specVersion: "3.0.1"} as any);

      expect(result1).toEqual(result2);
      expect(result1).toMatchSnapshot();
    });
  });
});
