import {expect} from "chai";
import {ParamMetadata} from "../domain/ParamMetadata";
import {ParamTypes} from "../domain/ParamTypes";
import {HeaderParams} from "./headerParams";

describe("@HeaderParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@HeaderParams("expression") header: string) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.HEADER);
  });
});
