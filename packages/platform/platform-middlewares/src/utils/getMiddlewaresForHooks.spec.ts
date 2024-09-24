import {DIConfiguration} from "@tsed/di";

import {getMiddlewaresForHook} from "./getMiddlewaresForHook.js";

describe("getMiddlewaresForHooks", () => {
  it("should return the middlewares for given hook (without default hook)", () => {
    const settings = new DIConfiguration();
    settings.set("middlewares", [
      {env: "production", use: vi.fn(), hook: "hook"},
      {use: vi.fn(), hook: "hook"}
    ]);

    const middlewares = getMiddlewaresForHook("hook", settings);

    expect(middlewares).toHaveLength(1);
  });
});
