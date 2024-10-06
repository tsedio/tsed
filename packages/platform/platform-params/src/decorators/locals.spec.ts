import {JsonParameterStore} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {Locals} from "./locals.js";

describe("@Locals", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@Locals("expression") test: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.LOCALS);
  });
});
