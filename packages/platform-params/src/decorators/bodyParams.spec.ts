import {expect} from "chai";
import {ParamMetadata} from "../domain/ParamMetadata";
import {ParamTypes} from "../domain/ParamTypes";
import {BodyParams} from "./bodyParams";

describe("@BodyParams", () => {
  it("should call useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@BodyParams("expression", Test) body: Test) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.BODY);
    expect(param.type).to.eq(Test);
  });
});
