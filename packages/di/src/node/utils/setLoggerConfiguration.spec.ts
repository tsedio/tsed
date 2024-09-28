import {Logger} from "@tsed/logger";

import {InjectorService} from "../../common/index.js";
import {setLoggerConfiguration} from "./setLoggerConfiguration.js";

describe("setLoggerConfiguration", () => {
  it("should change the logger level depending on the configuration", () => {
    const injector = new InjectorService();

    injector.settings.set("logger.level", "info");

    setLoggerConfiguration(injector);

    expect(injector.logger.level).toEqual("info");
  });
  it("should call $log.appenders.set()", () => {
    const injector = new InjectorService();
    injector.logger = new Logger();

    vi.spyOn(injector.logger.appenders, "set").mockResolvedValue(undefined);

    injector.settings.set("logger.format", "format");

    setLoggerConfiguration(injector);

    expect(injector.logger.appenders.set).toHaveBeenCalledWith("stdout", {
      type: "stdout",
      levels: ["info", "debug"],
      layout: {
        type: "pattern",
        pattern: "format"
      }
    });

    expect(injector.logger.appenders.set).toHaveBeenCalledWith("stderr", {
      levels: ["trace", "fatal", "error", "warn"],
      type: "stderr",
      layout: {
        type: "pattern",
        pattern: "format"
      }
    });
  });
});
