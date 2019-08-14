import {EndpointMetadata} from "@tsed/common";
import {Store} from "@tsed/core";
import * as Sinon from "sinon";
import {stub} from "../../../../test/helper/tools";
import {OpenApiEndpointBuilder} from "../../src/class/OpenApiEndpointBuilder";

class Test {
}

describe("OpenApiParamsBuilder", () => {
  let endpointMetadata: EndpointMetadata;
  let builder: OpenApiEndpointBuilder;

  before(() => {
    endpointMetadata = new EndpointMetadata({target: Test, propertyKey: "test"});
    builder = new OpenApiEndpointBuilder(endpointMetadata, "/test", {
      path: "/",
      method: "get"
    }, (s: any) => s);
    // builder.build();
  });

  after(() => {
  });

  describe("getTagName()", () => {
    const store = {
      get: Sinon.stub()
    };
    before(() => {
      Sinon.stub(Store, "from");
      stub(Store.from).returns(store);
    });

    after(() => {
      stub(Store.from).restore();
    });

    describe("with name", () => {
      before(() => {
        store.get.withArgs("name").returns("name");
      });

      after(() => {
        store.get.reset();
      });

      it("should return an array with tags", () => {
        // @ts-ignore
        builder.getTagName().should.deep.eq("name");
      });
    });

    describe("with name from the tag metadata", () => {
      before(() => {
        store.get.withArgs("tag").returns({name: "tagName"});
      });

      after(() => {
        store.get.reset();
      });

      it("should return an array with tags", () => {
        // @ts-ignore
        builder.getTagName().should.deep.eq("tagName");
      });
    });

    describe("with default name from endpoint", () => {
      before(() => {
        store.get.returns(undefined);
      });

      after(() => {
        store.get.reset();
      });

      it("should return an array with tags", () => {
        // @ts-ignore
        builder.getTagName().should.deep.eq("Test");
      });
    });
  });

  describe("createResponse()", () => {
    describe("without a response type", () => {
      const sandbox = Sinon.createSandbox();
      let result: any;
      before(() => {
        sandbox.stub(endpointMetadata, "statusResponse");
        // @ts-ignore
        sandbox.stub(builder, "createSchema");

        // @ts-ignore
        endpointMetadata.type = undefined;

        // @ts-ignore
        result = builder.createResponse(200, {
          description: "description",
          // @ts-ignore
          examples: "examples",
          // @ts-ignore
          headers: {header: "header"}
        });
      });

      after(() => {
        sandbox.restore();
      });

      it("should called the statusResponse", () => {
        return stub(endpointMetadata.statusResponse).should.be.calledOnce;
      });

      it("should not called createSchema", () => {
        // @ts-ignore
        return stub(builder.createSchema).should.not.be.called;
      });

      it("should return the response", () => {
        result.should.deep.eq({
          description: "description",
          examples: "examples",
          headers: {
            header: "header"
          }
        });
      });
    });

    describe("with a response type", () => {
      const sandbox = Sinon.createSandbox();
      let result: any;
      before(() => {
        sandbox.stub(endpointMetadata, "statusResponse");

        endpointMetadata.type = class Model {
        };

        // @ts-ignore
        sandbox.stub(builder, "createSchema");
        // @ts-ignore
        stub(builder.createSchema).returns({schema: "schema"});

        // @ts-ignore
        result = builder.createResponse(200, {
          description: "description",
          examples: "examples",
          headers: {header: "header"}
        } as any);
      });

      after(() => {
        sandbox.restore();
      });

      it("should call the statusResponse", () => {
        return stub(endpointMetadata.statusResponse).should.be.calledOnce;
      });

      it("should call createSchema", () => {
        // @ts-ignore
        return stub(builder.createSchema).should.be.calledOnce;
      });

      it("should return the response", () => {
        result.should.deep.eq({
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
