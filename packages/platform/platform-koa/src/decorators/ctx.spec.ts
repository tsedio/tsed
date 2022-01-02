import {Ctx} from "@tsed/platform-koa";
import {expect} from "chai";
import {JsonParameterStore} from "@tsed/schema";

describe("@Ctx", () => {
  it("should call store the right configuration", () => {
    class Ctrl {
      test(@Ctx() ctx: Ctx) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq("KOA_CTX");
  });
});
