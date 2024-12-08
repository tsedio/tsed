import {writeFile} from "node:fs/promises";

import {PlatformTest} from "@tsed/platform-http/testing";

import {OpenAPIService} from "../index.js";

vi.mock("node:fs/promises");

describe("SwaggerService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getOpenAPISpec()", () => {
    it("should compile spec only once time", async () => {
      const service = await PlatformTest.invoke<OpenAPIService>(OpenAPIService);
      const result1 = await service.getOpenAPISpec({specVersion: "3.0.1"} as any);
      const result2 = await service.getOpenAPISpec({specVersion: "3.0.1"} as any);

      expect(result1).toEqual(result2);
      expect(result1).toMatchSnapshot();
    });
  });

  describe("writeOpenAPISpec()", () => {
    it("should write spec only once time", async () => {
      const service = await PlatformTest.invoke<OpenAPIService>(OpenAPIService);

      await service.writeOpenAPISpec({specVersion: "3.0.1", outFile: "/path"} as any);

      expect(writeFile).toHaveBeenCalledWith("/path", expect.any(String), {
        encoding: "utf8"
      });
    });
  });
});
