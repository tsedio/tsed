import {createInjector, ServerSettingsService} from "@tsed/common";
import {Env} from "@tsed/core";
import {$log} from "@tsed/logger";
import * as Sinon from "sinon";
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

    const injector = createInjector(settings);

    injector.settings.should.instanceof(ServerSettingsService);
    injector.settings.test.should.eq("test");
    injector.logger.should.eq($log);
    injector.logger.stop.should.have.been.calledWithExactly();
  });

  it("should create injector", () => {
    const settings = {
      test: "test",
      env: Env.PROD
    };

    const injector = createInjector(settings);

    return injector.logger.stop.should.not.have.been.called;
  });
});
