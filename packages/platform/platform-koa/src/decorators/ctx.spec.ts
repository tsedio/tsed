import {ParamMetadata, ParamTypes} from "@tsed/common";
import {Ctx} from "@tsed/platform-koa";
import {expect} from "chai";
import {State} from "./state";

describe("@Ctx", () => {
  it("should call store the right configuration", () => {
    class Ctrl {
      test(@Ctx() ctx: Ctx) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq("KOA_CTX");
  });
});
