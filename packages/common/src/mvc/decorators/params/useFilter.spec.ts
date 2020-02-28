import {Property} from "@tsed/common";
import {Description, Example, Title} from "@tsed/swagger";
import {ParamRegistry, ParamTypes, Required, UseFilter} from "../../../../src/mvc";

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
    it("should create ParamMetadata (without filter)", () => {
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
    it("should create ParamMetadata (with filter)", () => {
      class Test {}

      class MyFilter {}

      class Ctrl {
        test(
          @UseFilter(MyFilter, {
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
      param.filter!.should.eq(MyFilter);
    });
  });
});
