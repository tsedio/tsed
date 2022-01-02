import {expect} from "chai";
import {ActionCtx} from "./actionCtx";
import {JsonParameterStore} from "@tsed/schema";

describe("@ActionCtx", () => {
  it("should inject ActionCtx", () => {
    class CustomAction {
      resolve(@ActionCtx() actionCtx: ActionCtx) {}
    }

    const param = JsonParameterStore.get(CustomAction, "resolve", 0);

    expect(param.expression).to.equal("ACTION_CTX");
  });

  it("should inject ActionCtx (with expression)", () => {
    class CustomAction {
      resolve(@ActionCtx("handler") actionCtx: ActionCtx) {}
    }

    const param = JsonParameterStore.get(CustomAction, "resolve", 0);

    expect(param.expression).to.equal("ACTION_CTX.handler");
  });
});
