import {InjectorService} from "@tsed/di";
import {expect} from "chai";
import {setLoggerLevel} from "./setLoggerLevel";

describe("setLoggerLevel", () => {
  it("should change the logger level depending on the configuration", () => {
    const injector = new InjectorService();

    injector.settings.set("logger.level", "info");

    setLoggerLevel(injector);

    expect(injector.logger.level).to.equal("info");
  });
});
