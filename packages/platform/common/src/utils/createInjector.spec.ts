import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";
import {PlatformConfiguration} from "../config/services/PlatformConfiguration.js";
import {FakeAdapter} from "../services/FakeAdapter.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";
import {createInjector} from "./createInjector.js";

describe("createInjector", () => {
  beforeEach(() => {
    jest.spyOn($log, "stop").mockReturnValue(undefined as any);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should create injector and stop logger in env Test", () => {
    const settings = {
      test: "test",
      env: Env.TEST
    };

    const injector = createInjector({settings, adapter: FakeAdapter});

    expect(injector.settings).toBeInstanceOf(PlatformConfiguration);
    expect(injector.settings.get("test")).toEqual("test");
    expect(injector.logger).toEqual($log);
    expect(injector.get(PlatformAdapter)).toBeInstanceOf(FakeAdapter);
  });

  it("should create injector", () => {
    const settings = {
      test: "test",
      env: Env.PROD
    };

    const injector = createInjector({settings, adapter: FakeAdapter});

    expect(injector.logger.stop).not.toBeCalled();
  });
});
