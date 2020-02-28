import {Property} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {Description, Example, Title} from "@tsed/swagger";
import {BodyParams, ParamRegistry, ParamTypes, Put, Required, UseFilter} from "../../../../src/mvc";

export class MyModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("example1", "Description example")
  @Property()
  public id: string;

  @Property()
  @Required()
  public name: string;
}

describe("@UseFilter", () => {
  describe("when filter is a class", () => {
    it("should create ParamMetadata", () => {
      class Test {}

      class Ctrl {
        test(
          @UseFilter(ParamTypes.BODY, {
            expression: "expression",
            useConverter: true,
            useValidation: true,
            paramType: ParamTypes.BODY,
            useType: Test
          })
          body: Test
        ) {}
      }

      const param = ParamRegistry.get(Ctrl, "test", 0);
      param.expression.should.eq("expression");
      param.paramType.should.eq(ParamTypes.BODY);
      param.type.should.eq(Test);
    });
    it("should store pipes", () => {
      class Ctrl {
        @Put("/")
        public save(
          @BodyParams("name")
          @Required()
          name: string
        ): MyModel {
          const model = new MyModel();
          model.id = "2";
          model.name = "test";

          return model;
        }
      }

      const param = ParamRegistry.get(Ctrl, "save", 0);
      param.expression.should.eq("name");
      param.paramType.should.eq(ParamTypes.BODY);
      param.type.should.eq(String);

      param.pipes.map(nameOf).should.deep.eq(["ParseExpressionPipe", "ValidationPipe", "DeserializerPipe"]);
    });
  });
});
