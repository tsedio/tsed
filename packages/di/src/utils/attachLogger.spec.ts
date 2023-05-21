import {Logger} from "@tsed/logger";
import {InjectorService} from "../services/InjectorService";
import {attachLogger} from "./attachLogger";

describe("attachLogger", () => {
  it("should attach logger", () => {
    const injector = new InjectorService();
    const $log = new Logger("test");

    attachLogger(injector, $log);

    expect(injector.logger).toEqual($log);
  });
});
