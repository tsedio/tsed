import {PlatformTest, ServerSettingsService} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {stub} from "../../../../test/helper/tools";
import {SwaggerService} from "../index";

class Test {}

describe("SwaggerService", () => {
  let swaggerService: SwaggerService;
  let settingsService: ServerSettingsService;

  before(() => PlatformTest.create());
  after(() => PlatformTest.reset());
  before(
    PlatformTest.inject(
      [SwaggerService, ServerSettingsService],
      (_swaggerService: SwaggerService, _serverSettingsService: ServerSettingsService) => {
        swaggerService = _swaggerService;
        settingsService = _serverSettingsService;
      }
    )
  );

  describe("getDefaultSpec()", () => {
    describe("when specPath is given", () => {
      it("should return default spec", () => {
        const result = swaggerService.getDefaultSpec({
          specPath: __dirname + "/data/spec.json"
        });

        expect(result).to.deep.equals(require("./data/spec.expected.json"));
      });
    });

    describe("when spec is given with produces fields", () => {
      it("should return default spec", () => {
        const result = swaggerService.getDefaultSpec({
          spec: {
            produces: ["application/json", "application/octet-stream", "application/xml"]
          }
        });

        expect(result).to.deep.equals({
          swagger: "2.0",
          info: {
            contact: undefined,
            description: "",
            license: undefined,
            termsOfService: "",
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json", "application/octet-stream", "application/xml"],
          consumes: ["application/json"],
          securityDefinitions: {}
        });
      });
    });

    describe("when nothing is given", () => {
      it("should return default spec", () => {
        const result = swaggerService.getDefaultSpec({});
        expect(result).to.deep.equals({
          consumes: ["application/json"],
          info: {
            contact: undefined,
            description: "",
            license: undefined,
            termsOfService: "",
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json"],
          securityDefinitions: {},
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
            contact: undefined,
            description: "",
            license: undefined,
            termsOfService: "",
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json"],
          securityDefinitions: {},
          swagger: "2.0"
        });
      });
    });
  });

  // describe("buildTags()", () => {
  //   describe("when name is undefined", () => {
  //     before(() => {
  //       Sinon.stub(Store, "from");
  //     });
  //     after(() => {
  //       stub(Store.from).restore();
  //     });
  //
  //     it("should return an array with tags", () => {
  //       // GIVEN
  //       const store = {
  //         get: Sinon.stub()
  //       };
  //
  //       stub(Store.from).returns(store);
  //
  //       store.get.withArgs("description").returns("description");
  //       store.get.withArgs("name").returns(undefined);
  //       store.get.withArgs("tag").returns({test: "tag"});
  //
  //       // WHEN
  //       // @ts-ignore
  //       const result = swaggerService.buildTags({useClass: Test});
  //
  //       // THEN
  //       expect(result).to.deep.eq({description: "description", name: "Test", test: "tag"});
  //     });
  //   });
  //   describe("when name is defined", () => {
  //     before(() => {
  //       Sinon.stub(Store, "from");
  //     });
  //     after(() => {
  //       stub(Store.from).restore();
  //     });
  //
  //     it("should return an array with tags", () => {
  //       // GIVEN
  //       const store = {
  //         get: Sinon.stub()
  //       };
  //
  //       stub(Store.from).returns(store);
  //
  //       store.get.withArgs("description").returns("description");
  //       store.get.withArgs("name").returns("name");
  //       store.get.withArgs("tag").returns({test: "tag"});
  //
  //       // WHEN
  //       // @ts-ignore
  //       const result = swaggerService.buildTags({useClass: Test});
  //
  //       expect(result).to.deep.eq({description: "description", name: "name", test: "tag"});
  //     });
  //   });
  // });

  describe("readSpecPath", () => {
    it("should return an empty object", () => {
      // @ts-ignore
      expect(swaggerService.readSpecPath("/swa.json")).to.deep.eq({});
    });
  });
  //
  // describe("getOperationId()", () => {
  //   it("should return the right id", () => {
  //     // @ts-ignore
  //     const getOperationId = swaggerService.createOperationIdFormatter({operationIdFormat: "%c.%m"});
  //     expect(getOperationId("class", "operation")).to.deep.eq("class.operation");
  //
  //     // @ts-ignore
  //     expect(getOperationId("class", "operation")).to.deep.eq("class.operation_1");
  //   });
  // });
});
