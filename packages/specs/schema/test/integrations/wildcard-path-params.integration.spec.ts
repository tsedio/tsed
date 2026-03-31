import "../../src/index.js";

import {Controller} from "@tsed/di";
import {PathParams} from "@tsed/platform-params";

import {Get, getSpec, SpecTypes} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

@Controller("/merged")
class TestWildcardPathCtrl {
  @Get("/:moduleUri*")
  get(@PathParams("moduleUri") moduleUri: string) {
    return moduleUri;
  }
}

@Controller("/rest")
class TestWildcardMultiplePathCtrl {
  @Get("/:moduleUri*/child/:id*")
  get(@PathParams("moduleUri") moduleUri: string, @PathParams("id") id: string) {
    return {moduleUri, id};
  }
}

describe("Spec: wildcard path params", () => {
  it("should generate the OS3 for a single wildcard path param", async () => {
    const spec = getSpec(TestWildcardPathCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec.paths).toEqual({
      "/merged/{moduleUri}": {
        get: {
          operationId: "testWildcardPathCtrlGet",
          parameters: [
            {
              in: "path",
              name: "moduleUri",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            "200": {
              description: "Success"
            }
          },
          tags: ["TestWildcardPathCtrl"]
        }
      }
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });

  it("should generate the OS3 for multiple wildcard path params", async () => {
    const spec = getSpec(TestWildcardMultiplePathCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec.paths).toEqual({
      "/rest/{moduleUri}/child/{id}": {
        get: {
          operationId: "testWildcardMultiplePathCtrlGet",
          parameters: [
            {
              in: "path",
              name: "moduleUri",
              required: true,
              schema: {
                type: "string"
              }
            },
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            "200": {
              description: "Success"
            }
          },
          tags: ["TestWildcardMultiplePathCtrl"]
        }
      }
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
