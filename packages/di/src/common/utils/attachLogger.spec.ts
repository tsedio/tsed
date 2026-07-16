import {Logger} from "@tsed/logger";
import {attachLogger} from "./attachLogger.js";
import {injector} from "../index.js";

describe("attachLogger", () => {
  it("should attach logger", () => {
    const $log = new Logger("test");

    attachLogger($log);

    expect(injector().logger).toEqual($log);
  });
});
