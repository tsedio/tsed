import {JsonParameterStore} from "@tsed/schema";

import {Ctx} from "./ctx.js";

describe("@Ctx", () => {
  it("should call store the right configuration", () => {
    class Ctrl {
      test(@Ctx() ctx: Ctx) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual("KOA_CTX");
  });
});
