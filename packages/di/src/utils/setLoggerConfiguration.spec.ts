import {InjectorService, setLoggerConfiguration} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {expect} from "chai";
import Sinon from "sinon";

describe("setLoggerConfiguration", () => {
  it("should change the logger level depending on the configuration", () => {
    const injector = new InjectorService();

    injector.settings.set("logger.level", "info");

    setLoggerConfiguration(injector);

    expect(injector.logger.level).to.equal("info");
  });
  it("should call $log.appenders.set()", () => {
    const injector = new InjectorService();
    injector.logger = new Logger();

    Sinon.stub(injector.logger.appenders, "set");

    injector.settings.set("logger.format", "format");

    setLoggerConfiguration(injector);

    expect(injector.logger.appenders.set).to.have.been.calledWithExactly("stdout", {
      type: "stdout",
      levels: ["info", "debug"],
      layout: {
        type: "pattern",
        pattern: "format"
      }
    });

    expect(injector.logger.appenders.set).to.have.been.calledWithExactly("stderr", {
      levels: ["trace", "fatal", "error", "warn"],
      type: "stderr",
      layout: {
        type: "pattern",
        pattern: "format"
      }
    });
  });
});
