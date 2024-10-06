import {Description, Example, Get, getSpec, JsonParameterStore, Property, Required, SpecTypes, Title} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {QueryParams} from "./queryParams.js";
import {UseParam} from "./useParam.js";

export class MyModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("Description example")
  @Property()
  public id: string;

  @Property()
  @Required()
  public name: string;
}

describe("@UseParam", () => {
  describe("when use a param", () => {
    it("should create useParam", () => {
      class Test {}

      class Ctrl {
        test(
          @UseParam({
            expression: "expression",
            useMapper: true,
            useValidation: true,
            paramType: ParamTypes.BODY,
            useType: Test
          })
          body: Test
        ) {}
      }

      const param = JsonParameterStore.get(Ctrl, "test", 0);
      expect(param.expression).toEqual("expression");
      expect(param.paramType).toEqual(ParamTypes.BODY);
      expect(param.type).toEqual(Test);
    });
  });
  describe("when is a Query param with boolean", () => {
    it("should return the right spec", () => {
      class Ctrl {
        @Get("/")
        get(@QueryParams("test") value: boolean) {}
      }

      const spec = getSpec(Ctrl, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        paths: {
          "/": {
            get: {
              operationId: "ctrlGet",
              parameters: [
                {
                  in: "query",
                  name: "test",
                  required: false,
                  schema: {type: "boolean"}
                }
              ],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Ctrl"]
            }
          }
        },
        tags: [
          {
            name: "Ctrl"
          }
        ]
      });
    });
  });
});
