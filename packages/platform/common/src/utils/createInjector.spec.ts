import {expect} from "chai";
import {createInjector, PlatformConfiguration} from "@tsed/common";
import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";
import Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";

describe("createInjector", () => {
  beforeEach(() => {
    Sinon.stub($log, "stop");
  });
  afterEach(() => {
    stub($log.stop).restore();
  });
  it("should create injector and stop logger in env Test", () => {
    const settings = {
      test: "test",
      env: Env.TEST
    };

    const injector = createInjector({settings});

    expect(injector.settings).to.be.instanceof(PlatformConfiguration);
    expect(injector.settings.test).to.eq("test");
    expect(injector.logger).to.eq($log);
  });

  it("should create injector", () => {
    const settings = {
      test: "test",
      env: Env.PROD
    };

    const injector = createInjector({settings});

    return expect(injector.logger.stop).to.not.have.been.called;
  });
});
