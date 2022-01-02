import {expect} from "chai";
import {ParamTypes} from "../domain/ParamTypes";
import {HeaderParams} from "./headerParams";
import {JsonParameterStore} from "@tsed/schema";

describe("@HeaderParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@HeaderParams("expression") header: string) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.HEADER);
  });
});
