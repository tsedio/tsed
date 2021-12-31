import {Get} from "@tsed/common";
import {Description, Example, getSpec, Property, Required, SpecTypes, Title} from "@tsed/schema";
import {expect} from "chai";
import {ParamMetadata} from "../domain/ParamMetadata";
import {ParamTypes} from "../domain/ParamTypes";
import {QueryParams} from "./queryParams";
import {UseParam} from "./useParam";

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
          @UseParam(ParamTypes.BODY, {
            expression: "expression",
            useConverter: true,
            useValidation: true,
            paramType: ParamTypes.BODY,
            useType: Test
          })
          body: Test
        ) {}
      }

      const param = ParamMetadata.get(Ctrl, "test", 0);
      expect(param.expression).to.eq("expression");
      expect(param.paramType).to.eq(ParamTypes.BODY);
      expect(param.type).to.eq(Test);
    });
  });
  describe("when is a Query param with boolean", () => {
    it("should return the right spec", () => {
      class Ctrl {
        @Get("/")
        get(@QueryParams("test") value: boolean) {}
      }

      const spec = getSpec(Ctrl, {specType: SpecTypes.OPENAPI});

      expect(spec).to.deep.equal({
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
