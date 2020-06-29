import {Metadata} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {EndpointMetadata, EndpointMetadata} from "../../../src/mvc";

class Test {}

class Test2 {}

class Test3 extends Test2 {}

describe("EndpointMetadata", () => {
  describe("Basic class", () => {
    it("should return an endpoint metadata", () => {
      // GIVEN
      const endpointMetadata = new EndpointMetadata({
        target: Test,
        propertyKey: "method",
        beforeMiddlewares: [() => {}],
        middlewares: [() => {}],
        afterMiddlewares: [() => {}]
      });

      endpointMetadata.before([() => {}]);
      endpointMetadata.after([() => {}]);

      EndpointMetadata.store(Test, "method").set("test", "value");

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

  describe("statusResponse()", () => {
    describe("when haven't responses", () => {
      it("should haven't type, headers and collectionType", () => {
        // GIVEN
        const endpointMetadata = new EndpointMetadata({target: Test, propertyKey: "method"});
        Sinon.stub(endpointMetadata.store, "get");

        stub(endpointMetadata.store.get)
          .withArgs("responses")
          .returns({});

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        expect(result).to.deep.eq({
          code: 200
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

        stub(endpointMetadata.store.get)
          .withArgs("responses")
          .returns({
            [200]: {}
          });

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        // THEN
        expect(result).to.deep.eq({
          code: 200
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
        endpointMetadata.responses.set(200, {
          type: Test,
          headers: {
            headerName: {
              type: "string",
              value: "x-content"
            }
          }
        } as any);

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        // THEN
        expect(result).to.deep.eq({
          headers: {
            headerName: {
              type: "string",
              value: "x-content"
            }
          },
          type: Test
        });
        expect(endpointMetadata.type).to.eq(Test);
        expect(endpointMetadata.collectionType).to.eq(undefined);
      });
    });
  });
});
