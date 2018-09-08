import {ServerSettingsService} from "@tsed/common";
import {Store} from "@tsed/core";
import {inject} from "@tsed/testing";
import {SwaggerService} from "../../../../packages/swagger/src";
import {expect, Sinon} from "../../../tools";

class Test {}

describe("SwaggerService", () => {
  before(
    inject([SwaggerService, ServerSettingsService], (swaggerService: SwaggerService, serverSettingsService: ServerSettingsService) => {
      this.swaggerService = swaggerService;
      this.settingsService = serverSettingsService;
    })
  );

  describe("getDefaultSpec()", () => {
    describe("when specPath is given", () => {
      before(() => {
        return (this.result = this.swaggerService.getDefaultSpec({specPath: __dirname + "/data/spec.json"}));
      });

      it("should return default spec", () => {
        this.result.should.be.deep.equals(require("./data/spec.expected.json"));
      });
    });

    describe("when spec is given with produces fields", () => {
      before(() => {
        return (this.result = this.swaggerService.getDefaultSpec({
          spec: {
            produces: ["application/json", "application/octet-stream", "application/xml"]
          }
        }));
      });

      it("should return default spec", () => {
        this.result.should.be.deep.equals({
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
      before(() => {
        return (this.result = this.swaggerService.getDefaultSpec({}));
      });

      it("should return default spec", () => {
        this.result.should.be.deep.equals({
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
      before(() => {
        return (this.result = this.swaggerService.getDefaultSpec({spec: {info: {}}}));
      });

      it("should return default spec", () => {
        this.result.should.be.deep.equals({
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

  describe("buildTags()", () => {
    describe("when name is undefined", () => {
      before(() => {
        this.storeFromStub = Sinon.stub(Store, "from");
        const store = {
          get: Sinon.stub()
        };
        this.storeFromStub.returns(store);
        store.get.withArgs("description").returns("description");
        store.get.withArgs("name").returns(undefined);
        store.get.withArgs("tag").returns({test: "tag"});

        this.result = this.swaggerService.buildTags({useClass: Test});
      });
      after(() => {
        this.storeFromStub.restore();
      });

      it("should return an array with tags", () => {
        this.result.should.deep.eq({description: "description", name: "Test", test: "tag"});
      });
    });
    describe("when name is defined", () => {
      before(() => {
        this.storeFromStub = Sinon.stub(Store, "from");
        const store = {
          get: Sinon.stub()
        };
        this.storeFromStub.returns(store);
        store.get.withArgs("description").returns("description");
        store.get.withArgs("name").returns("name");
        store.get.withArgs("tag").returns({test: "tag"});

        this.result = this.swaggerService.buildTags({useClass: Test});
      });
      after(() => {
        this.storeFromStub.restore();
      });

      it("should return an array with tags", () => {
        this.result.should.deep.eq({description: "description", name: "name", test: "tag"});
      });
    });
  });

  describe("readSpecPath", () => {
    it("should return an empty object", () => {
      expect(this.swaggerService.readSpecPath("/swa.json")).to.deep.eq({});
    });
  });

  describe("getOperationId()", () => {
    before(() => {
      this.getOperationId = this.swaggerService.createOperationIdFormatter({operationIdFormat: "%c.%m"});
    });
    it("should return the right id", () => {
      expect(this.getOperationId("class", "operation")).to.deep.eq("class.operation");
    });

    it("should return the right id with increment", () => {
      expect(this.getOperationId("class", "operation")).to.deep.eq("class.operation_1");
    });
  });
});
