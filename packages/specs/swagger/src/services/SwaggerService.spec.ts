import {PlatformTest} from "@tsed/common";
import {SwaggerService} from "../index";

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
