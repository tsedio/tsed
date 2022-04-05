import {expect} from "chai";
import {createInjector, PlatformAdapter, PlatformConfiguration} from "@tsed/common";
import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";
import Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {FakeAdapter} from "../services/FakeAdapter";

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

    const injector = createInjector({settings, adapter: FakeAdapter});

    expect(injector.settings).to.be.instanceof(PlatformConfiguration);
    expect(injector.settings.test).to.eq("test");
    expect(injector.logger).to.eq($log);
    expect(injector.get(PlatformAdapter)).to.be.instanceOf(FakeAdapter);
  });

  it("should create injector", () => {
    const settings = {
      test: "test",
      env: Env.PROD
    };

    const injector = createInjector({settings, adapter: FakeAdapter});

    expect(injector.logger.stop).to.not.have.been.called;
  });
});
