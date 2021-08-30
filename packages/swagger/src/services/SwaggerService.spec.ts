import {PlatformConfiguration, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {SwaggerService} from "../index";

describe("SwaggerService", () => {
  let swaggerService: SwaggerService;
  let settingsService: PlatformConfiguration;

  before(() => PlatformTest.create());
  after(() => PlatformTest.reset());
  before(
    PlatformTest.inject(
      [SwaggerService, PlatformConfiguration],
      (_swaggerService: SwaggerService, _serverSettingsService: PlatformConfiguration) => {
        swaggerService = _swaggerService;
        settingsService = _serverSettingsService;
      }
    )
  );
  describe("getOpenAPISpec()", () => {
    it("should compile spec only once time", () => {
      const result1 = swaggerService.getOpenAPISpec({specVersion: "3.0.1"} as any);
      const result2 = swaggerService.getOpenAPISpec({specVersion: "3.0.1"} as any);

      expect(result1).to.eq(result2);
    });
  });
  describe("getDefaultSpec()", () => {
    describe("when specPath is given", () => {
      it("should return default spec", () => {
        // @ts-ignore
        const result = swaggerService.getDefaultSpec({
          specPath: __dirname + "/data/spec.json"
        });

        expect(result).to.deep.equals(require("./data/spec.expected.json"));
      });
    });

    describe("when spec is given with produces fields", () => {
      it("should return default spec", () => {
        // @ts-ignore
        const result = swaggerService.getDefaultSpec({
          spec: {
            produces: ["application/json", "application/octet-stream", "application/xml"]
          }
        });

        expect(result).to.deep.equals({
          swagger: "2.0",
          info: {
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json", "application/octet-stream", "application/xml"],
          consumes: ["application/json"]
        });
      });
    });

    describe("when nothing is given", () => {
      it("should return default spec", () => {
        // @ts-ignore
        const result = swaggerService.getDefaultSpec({});
        expect(result).to.deep.equals({
          consumes: ["application/json"],
          info: {
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json"],
          swagger: "2.0"
        });
      });
    });

    describe("when some info is given", () => {
      it("should return default spec", () => {
        // @ts-ignore
        const result = swaggerService.getDefaultSpec({spec: {info: {}}});

        expect(result).to.deep.equals({
          consumes: ["application/json"],
          info: {
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json"],
          swagger: "2.0"
        });
      });
    });
  });
  describe("readSpecPath", () => {
    it("should return an empty object", () => {
      // @ts-ignore
      expect(swaggerService.readSpecPath("/swa.json")).to.deep.eq({});
    });
  });
});
