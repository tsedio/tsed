import {DIConfiguration} from "@tsed/di";
import {getMiddlewaresForHook} from "./getMiddlewaresForHook";

describe("getMiddlewaresForHooks", () => {
  it("should return the middlewares for given hook (without default hook)", () => {
    const settings = new DIConfiguration();
    settings.set("middlewares", [jest.fn(), {env: "production", use: jest.fn(), hook: "hook"}, {use: jest.fn(), hook: "hook"}]);

    const middlewares = getMiddlewaresForHook("hook", settings);

    expect(middlewares).toHaveLength(1);
  });

  it("should return the middlewares for given hook", () => {
    const settings = new DIConfiguration();
    settings.set("middlewares", [jest.fn(), {env: "production", use: jest.fn(), hook: "hook"}, {use: jest.fn(), hook: "hook"}]);

    const middlewares = getMiddlewaresForHook("hook", settings, "hook");

    expect(middlewares).toHaveLength(2);
  });
});
