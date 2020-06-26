import {expect} from "chai";
import {EndpointMetadata, Property} from "@tsed/common";
import {Store} from "@tsed/core";
import * as Sinon from "sinon";
import {stub} from "../../../../test/helper/tools";
import {OpenApiEndpointBuilder} from "./OpenApiEndpointBuilder";

class Test {}

describe("OpenApiParamsBuilder", () => {
  let endpointMetadata: EndpointMetadata;
  let builder: OpenApiEndpointBuilder;

  before(() => {
    endpointMetadata = new EndpointMetadata({target: Test, propertyKey: "test"});
    builder = new OpenApiEndpointBuilder(
      endpointMetadata,
      "/test",
      {
        path: "/",
        method: "get"
      },
      (s: any) => s
    );
  });

  after(() => {});

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
        expect(builder.getTagName()).to.deep.eq("name");
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
        expect(builder.getTagName()).to.deep.eq("tagName");
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
        expect(builder.getTagName()).to.deep.eq("Test");
      });
    });
  });

  describe("createResponse()", () => {
    it("should return the response when the type is missing", () => {
      const endpoint = new EndpointMetadata({
        target: Test,
        propertyKey: "test"
      });

      const builder = new OpenApiEndpointBuilder(
        endpoint,
        "/test",
        {
          path: "/",
          method: "get"
        },
        (s: any) => s
      );

      // @ts-ignore
      const result = builder.createResponse(200, {
        description: "description",
        // @ts-ignore
        examples: "examples",
        // @ts-ignore
        headers: {
          header: {
            type: "string",
            value: "application/json"
          }
        }
      } as any);

      expect(result).to.deep.eq({
        description: "description",
        examples: "examples",
        headers: {
          header: {
            type: "string"
          }
        }
      });
    });
    it("should return the response when the type is given (200)", () => {
      class MyModel {
        @Property()
        prop: string;
      }

      const endpoint = new EndpointMetadata({
        target: Test,
        propertyKey: "test"
      });
      endpoint.responses.set(200, {
        type: MyModel
      } as any);

      const builder = new OpenApiEndpointBuilder(
        endpoint,
        "/test",
        {
          path: "/",
          method: "get"
        },
        (s: any) => s
      );

      // @ts-ignore
      const result = builder.createResponse(200, {
        description: "description",
        examples: "examples",
        headers: {
          header: {
            type: "string",
            value: "application/json"
          }
        }
      } as any);

      expect(result).to.deep.eq({
        description: "description",
        examples: "examples",
        headers: {
          header: {
            type: "string"
          }
        },
        schema: {
          $ref: "#/definitions/MyModel"
        }
      });
    });
    it("should return the response when the type is given (400)", () => {
      class NotFound {
        @Property()
        prop: string;
      }

      const endpoint = new EndpointMetadata({
        target: Test,
        propertyKey: "test"
      });
      endpoint.responses.set(400, {
        type: NotFound
      } as any);
      endpoint.responses.set(200, {
        type: undefined,
        description: "Success"
      } as any);

      const builder = new OpenApiEndpointBuilder(
        endpoint,
        "/test",
        {
          path: "/",
          method: "get"
        },
        (s: any) => s
      );

      // @ts-ignore
      const result = builder.createResponse(400, {
        description: "description",
        examples: "examples",
        headers: {
          header: {
            type: "string",
            value: "application/json"
          }
        }
      } as any);

      expect(result).to.deep.eq({
        description: "description",
        examples: "examples",
        headers: {
          header: {
            type: "string"
          }
        },
        schema: {
          $ref: "#/definitions/NotFound"
        }
      });

      // @ts-ignore
      const result2 = builder.createResponse(200, {
        description: "description",
        examples: "examples",
        headers: {
          header: {
            type: "string",
            value: "application/json"
          }
        }
      } as any);

      expect(result2).to.deep.eq({
        description: "Success",
        examples: "examples",
        headers: {
          header: {
            type: "string"
          }
        }
      });
    });
  });
});
