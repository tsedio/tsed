import {Metadata} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {EndpointMetadata, EndpointRegistry} from "../../../src/mvc";

class Test {
}

class Test2 {
}

class Test3 extends Test2 {
}

describe("EndpointMetadata", () => {
  describe("Basic class", () => {
    it("should return an endpoint metadata", () => {
      // GIVEN
      const endpointMetadata = new EndpointMetadata({
        target: Test,
        propertyKey: "method",
        beforeMiddlewares: [
          () => {
          }
        ],
        middlewares: [() => {
        }],
        afterMiddlewares: [() => {
        }]
      });
      
      endpointMetadata.before([() => {
      }]);
      endpointMetadata.after([() => {
      }]);

      EndpointRegistry.store(Test, "method").set("test", "value");

      Metadata.set("design:returntype", Object, Test, "method");

      const store: any = {};
      endpointMetadata.store.forEach((v: any, k: any) => (store[k] = v));

      // THEN
      expect(endpointMetadata.beforeMiddlewares)
        .to.be.an("array")
        .and.have.length(2);

      expect(endpointMetadata.middlewares)
        .to.be.an("array")
        .and.have.length(1);

      expect(endpointMetadata.beforeMiddlewares)
        .to.be.an("array")
        .and.have.length(2);

      expect(endpointMetadata.target).to.equal(Test);

      expect(endpointMetadata.methodClassName).to.equal("method");

      expect(store).to.deep.equal({test: "value"});
    });
  });

  describe("Inherited class", () => {
    it("should return an endpointmetadata", () => {
      // GIVEN
      const endpointMetadata = new EndpointMetadata({target: Test2, propertyKey: "methodInherited"});
      endpointMetadata.beforeMiddlewares = [() => {
      }];
      endpointMetadata.middlewares = [() => {
      }];
      endpointMetadata.afterMiddlewares = [() => {
      }];
      endpointMetadata.before([() => {
      }]);
      endpointMetadata.after([() => {
      }]);

      EndpointRegistry.store(Test2, "methodInherited").set("test2", "value2");

      Metadata.set("design:returntype", Object, Test2, "methodInherited");

      // WHEN
      const endpointMetadataInherited = endpointMetadata.inherit(Test3);

      const store: any = {};
      endpointMetadataInherited.store.forEach((v: any, k: any) => (store[k] = v));

      // THEN
      expect(endpointMetadataInherited.beforeMiddlewares)
        .to.be.an("array")
        .and.have.length(2);
      expect(endpointMetadataInherited.middlewares)
        .to.be.an("array")
        .and.have.length(1);
      expect(endpointMetadataInherited.beforeMiddlewares)
        .to.be.an("array")
        .and.have.length(2);
      expect(endpointMetadataInherited.target).to.equal(Test3);
      // @ts-ignore
      expect(endpointMetadataInherited.inheritedEndpoint.target).to.equal(Test2);
      expect(endpointMetadata.methodClassName).to.equal("methodInherited");
      expect(store).to.deep.equal({test2: "value2"});
    });
  });

  describe("statusResponse()", () => {
    describe("when haven't responses", () => {
      it("should haven't type, headers and collectionType", () => {
        // GIVEN
        const endpointMetadata = new EndpointMetadata({target: Test, propertyKey: "method"});
        Sinon.stub(endpointMetadata.store, "get");

        stub(endpointMetadata.store.get).withArgs("responses").returns({});

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        expect(result).to.deep.eq({
          description: undefined,
          headers: undefined,
          examples: undefined
        });

        expect(endpointMetadata.type).to.eq(undefined);
        expect(endpointMetadata.collectionType).to.eq(undefined);

        stub(endpointMetadata.store.get).restore();
      });
    });

    describe("when have empty responses", () => {
      it("should haven't type, headers and collectionType", () => {
        // GIVEN
        const endpointMetadata = new EndpointMetadata({target: Test, propertyKey: "method"});
        Sinon.stub(endpointMetadata.store, "get");

        stub(endpointMetadata.store.get).withArgs("responses").returns({
          [200]: {}
        });

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        // THEN
        expect(result).to.deep.eq({
          description: undefined,
          examples: undefined,
          headers: undefined
        });

        expect(endpointMetadata.type).to.eq(undefined);
        expect(endpointMetadata.collectionType).to.eq(undefined);

        stub(endpointMetadata.store.get).restore();
      });
    });

    describe("when have responses", () => {
      it("should have type and headers and haven't collectionType", () => {
        // GIVEN
        const endpointMetadata = new EndpointMetadata({target: Test, propertyKey: "method"});
        Sinon.stub(endpointMetadata.store, "get");
        const responses = {
          [200]: {
            type: Test,
            headers: {
              headerName: {
                type: "string",
                value: "x-content"
              }
            }
          }
        };
        stub(endpointMetadata.store.get).withArgs("responses").returns(responses);

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        // THEN
        expect(result).to.deep.eq({
          description: undefined,
          examples: undefined,
          headers: {
            headerName: {
              type: "string"
            }
          }
        });
        expect(endpointMetadata.type).to.eq(Test);
        expect(endpointMetadata.collectionType).to.eq(undefined);
        responses[200].headers.headerName.value.should.be.eq("x-content");

        stub(endpointMetadata.store.get).restore();
      });
    });

    describe("when the status code match with the default response", () => {
      it("shouldn't change the original response, have type, haven't collectionType", () => {
        // GIVEN
        const endpointMetadata = new EndpointMetadata({target: Test, propertyKey: "method"});
        Sinon.stub(endpointMetadata.store, "get");
        const responses = {
          [200]: {
            type: Test,
            description: "description"
          }
        };
        const response = {
          type: Test,
          headers: {
            headerName: {
              type: "string",
              value: "x-content"
            }
          }
        };

        stub(endpointMetadata.store.get).withArgs("statusCode").returns(200);
        stub(endpointMetadata.store.get).withArgs("responses").returns(responses);
        stub(endpointMetadata.store.get).withArgs("response").returns(response);

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        // THEN
        expect(endpointMetadata.type).to.eq(Test);
        expect(endpointMetadata.collectionType).to.eq(undefined);
        expect(result).to.deep.eq({
          examples: undefined,
          description: "description",
          headers: {
            headerName: {
              type: "string"
            }
          }
        });
        response.headers.headerName.value.should.be.eq("x-content");

        stub(endpointMetadata.store.get).restore();
      });
    });
  });
});
