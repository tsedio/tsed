import {expect} from "chai";
import {ParamTypes} from "../domain/ParamTypes";
import {Locals} from "./locals";
import {JsonParameterStore} from "@tsed/schema";

describe("@Locals", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@Locals("expression") test: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.LOCALS);
  });
});
