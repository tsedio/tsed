import {Logger} from "@tsed/logger";

import {injector} from "../../common/index.js";
import {attachLogger} from "./attachLogger.js";

describe("attachLogger", () => {
  it("should attach logger", () => {
    const $log = new Logger("test");

    attachLogger($log);

    expect(injector().logger).toEqual($log);
  });
});
