import {Perf} from "@tsed/perf";
import {mergeSpec} from "@tsed/schema";
import {expect} from "chai";

describe("MergeSpec", () => {
  it("should merge spec", async () => {
    const spec1 = {
      paths: {
        "/rest/api/1.0/test": {
          get: {
            operationId: "helloWorldControllerGet",
            responses: {"200": {description: "Success"}},
            parameters: [],
            tags: ["HelloWorldController"]
          }
        },
        "/rest/api/1.0/test/{id}": {
          get: {
            operationId: "helloWorldControllerGetById",
            responses: {"200": {description: "Success"}},
            parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
            tags: ["HelloWorldController"]
          }
        },
        "/rest/api/2.0/test": {
          get: {
            operationId: "helloWorldController2Get",
            responses: {"200": {description: "Success"}},
            parameters: [],
            tags: ["HelloWorldController2"]
          }
        },
        "/rest/api/2.0/test/{id}": {
          get: {
            operationId: "helloWorldController2GetById",
            responses: {"200": {description: "Success"}},
            parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
            tags: ["HelloWorldController2"]
          }
        }
      }
    };

    const spec2 = {
      components: undefined,
      paths: {
        "/rest/api/1.0/test": {
          get: {
            operationId: "helloWorldControllerGet",
            responses: {"200": {description: "Success"}},
            parameters: [],
            tags: ["HelloWorldController"]
          }
        },
        "/rest/api/1.0/test/{id}": {
          get: {
            operationId: "helloWorldControllerGetById",
            responses: {"200": {description: "Success"}},
            parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
            tags: ["HelloWorldController"]
          }
        },
        "/rest/api/2.0/test": {
          get: {
            operationId: "helloWorldController2Get",
            responses: {"200": {description: "Success"}},
            parameters: [],
            tags: ["HelloWorldController2"]
          }
        },
        "/rest/api/2.0/test/{id}": {
          get: {
            operationId: "helloWorldController2GetById",
            responses: {"200": {description: "Success"}},
            parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
            tags: ["HelloWorldController2"]
          }
        }
      }
    };

    const perf = new Perf();

    const time = await perf.runFor(1000, () => {
      mergeSpec(spec1, spec2);
    });

    console.log(time);
    expect(time).to.be.below(700);
  });
});
