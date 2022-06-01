import {createInjector, PlatformAdapter, PlatformConfiguration} from "@tsed/common";
import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";
import {FakeAdapter} from "../services/FakeAdapter";

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
