import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";

import {FakeAdapter} from "../../testing/FakeAdapter.js";
import {PlatformConfiguration} from "../config/services/PlatformConfiguration.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";
import {createInjector} from "./createInjector.js";

describe("createInjector", () => {
  beforeEach(() => {
    vi.spyOn($log, "stop").mockReturnValue(undefined as any);
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("should create injector and stop logger in env Test", () => {
    const settings = {
      test: "test",
      env: Env.TEST,
      adapter: FakeAdapter
    };

    const injector = createInjector(settings);

    expect(injector.settings).toBeInstanceOf(PlatformConfiguration);
    expect(injector.settings.get("test")).toEqual("test");
    expect(injector.logger).toEqual($log);
    expect(injector.get(PlatformAdapter)).toBeInstanceOf(FakeAdapter);
  });

  it("should create injector", () => {
    const settings = {
      test: "test",
      env: Env.PROD,
      adapter: FakeAdapter
    };

    const injector = createInjector(settings);

    expect(injector.logger.stop).not.toHaveBeenCalled();
  });
});
