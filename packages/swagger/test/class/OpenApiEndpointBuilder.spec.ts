import {Store} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointMetadata} from "../../../common/src/mvc/class/EndpointMetadata";
import {OpenApiEndpointBuilder} from "../../src/class/OpenApiEndpointBuilder";

class Test {
}

describe("OpenApiParamsBuilder", () => {
  before(() => {
    this.endpointMetadata = new EndpointMetadata(Test, "test");
    this.builder = new OpenApiEndpointBuilder(this.endpointMetadata, "/test", {
      path: "/",
      method: "get"
    }, (s: any) => s);
    // this.builder.build();
  });

  after(() => {
  });

  describe("getTagName()", () => {
    const store = {
      get: Sinon.stub()
    };
    before(() => {
      this.storeFromStub = Sinon.stub(Store, "from");
      this.storeFromStub.returns(store);
    });

    after(() => {
      this.storeFromStub.restore();
    });

    describe("with name", () => {
      before(() => {
        store.get.withArgs("name").returns("name");
        this.result = this.builder.getTagName();
      });

      after(() => {
        store.get.reset();
      });

      it("should return an array with tags", () => {
        this.result.should.deep.eq("name");
      });
    });

    describe("with name from the tag metadata", () => {
      before(() => {
        store.get.withArgs("tag").returns({name: "tagName"});
        this.result = this.builder.getTagName();
      });

      after(() => {
        store.get.reset();
      });

      it("should return an array with tags", () => {
        this.result.should.deep.eq("tagName");
      });
    });

    describe("with default name from endpoint", () => {
      before(() => {
        store.get.returns(undefined);
        this.result = this.builder.getTagName();
      });

      after(() => {
        store.get.reset();
      });

      it("should return an array with tags", () => {
        this.result.should.deep.eq("Test");
      });
    });
  });

  describe("createResponse()", () => {
    describe("without a response type", () => {
      before(() => {
        this.statusResponseStub = Sinon.stub(this.endpointMetadata, "statusResponse");
        this.createSchemaStub = Sinon.stub(this.builder, "createSchema");
        this.endpointMetadata.type = undefined;
        this.result = this.builder.createResponse(200, {
          description: "description",
          examples: "examples",
          headers: {header: "header"}
        });
      });

      after(() => {
        this.statusResponseStub.restore();
        this.createSchemaStub.restore();
      });

      it("should called the statusResponse", () => {
        return this.statusResponseStub.should.be.calledOnce;
      });

      it("should not called createSchema", () => {
        return this.createSchemaStub.should.not.be.called;
      });

      it("should return the response", () => {
        this.result.should.deep.eq({
          description: "description",
          examples: "examples",
          headers: {
            header: "header"
          }
        });
      });
    });

    describe("with a response type", () => {
      before(() => {
        this.statusResponseStub = Sinon.stub(this.endpointMetadata, "statusResponse");

        this.endpointMetadata.type = class Model {
        };

        this.createSchemaStub = Sinon.stub(this.builder, "createSchema");
        this.createSchemaStub.returns({schema: "schema"});

        this.result = this.builder.createResponse(200, {
          description: "description",
          examples: "examples",
          headers: {header: "header"}
        });
      });

      after(() => {
        this.statusResponseStub.restore();
        this.createSchemaStub.restore();
      });

      it("should call the statusResponse", () => {
        return this.statusResponseStub.should.be.calledOnce;
      });

      it("should call createSchema", () => {
        return this.createSchemaStub.should.be.calledOnce;
      });

      it("should return the response", () => {
        this.result.should.deep.eq({
          description: "description",
          examples: "examples",
          headers: {
            header: "header"
          },
          schema: {schema: "schema"}
        });
      });
    });
  });
});
