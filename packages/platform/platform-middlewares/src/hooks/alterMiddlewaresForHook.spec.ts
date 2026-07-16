import {DITest, constant} from "@tsed/di";
import type {PlatformMiddlewareLoadingOptions} from "../domain/PlatformMiddlewareSettings.js";
import {alterMiddlewaresForHook} from "./alterMiddlewaresForHook.js";

describe("$alterMiddlewaresForHook", () => {
  beforeEach(() =>
    DITest.create({
      middlewares: [
        {env: "production", use: vi.fn(), hook: "hook"},
        {use: vi.fn(), hook: "hook"}
      ]
    })
  );
  afterEach(() => DITest.reset());

  it("should return the middlewares for given hook (without default hook)", () => {
    const input = constant<PlatformMiddlewareLoadingOptions[]>("middlewares", []);
    const middlewares = alterMiddlewaresForHook(input, "hook");

    expect(middlewares).toHaveLength(1);
  });
});
