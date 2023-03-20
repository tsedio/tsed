import {ParamTypes} from "../domain/ParamTypes";
import {Context} from "./context";
import {JsonParameterStore} from "@tsed/schema";

describe("@Context ", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@Context("expression") test: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.$CTX);
  });
});
