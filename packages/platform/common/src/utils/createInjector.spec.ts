import {expect} from "chai";
import {createInjector, PlatformAdapter, PlatformConfiguration} from "@tsed/common";
import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";
import Sinon from "sinon";

describe("createInjector", () => {
  beforeEach(() => {
    Sinon.stub($log, "stop");
  });
  afterEach(() => {
    Sinon.restore();
  });
  it("should create injector and stop logger in env Test", () => {
    const settings = {
      test: "test",
      env: Env.TEST
    };

    const injector = createInjector({
      adapter: PlatformAdapter,
      settings
    });

    expect(injector.settings).to.be.instanceof(PlatformConfiguration);
    expect(injector.settings.test).to.eq("test");
    expect(injector.logger).to.eq($log);
  });

  it("should create injector", () => {
    const settings = {
      test: "test",
      env: Env.PROD
    };

    const injector = createInjector({
      adapter: PlatformAdapter,
      settings
    });

    return expect(injector.logger.stop).to.not.have.been.called;
  });
});
