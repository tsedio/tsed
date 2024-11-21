import {Logger} from "@tsed/logger";
import {afterEach} from "vitest";

import {destroyInjector, injector} from "../../common/index.js";
import {setLoggerConfiguration} from "./setLoggerConfiguration.js";

describe("setLoggerConfiguration", () => {
  afterEach(() => destroyInjector());
  it("should change the logger level depending on the configuration", () => {
    injector().settings.set("logger.level", "info");

    setLoggerConfiguration();

    expect(injector().logger.level).toEqual("info");
  });
  it("should call $log.appenders.set()", () => {
    injector().logger = new Logger();

    vi.spyOn(injector().logger.appenders, "set").mockResolvedValue(undefined);

    injector().settings.set("logger.format", "format");

    setLoggerConfiguration();

    expect(injector().logger.appenders.set).toHaveBeenCalledWith("stdout", {
      type: "stdout",
      levels: ["info", "debug"],
      layout: {
        type: "pattern",
        pattern: "format"
      }
    });

    expect(injector().logger.appenders.set).toHaveBeenCalledWith("stderr", {
      levels: ["trace", "fatal", "error", "warn"],
      type: "stderr",
      layout: {
        type: "pattern",
        pattern: "format"
      }
    });
  });
});
