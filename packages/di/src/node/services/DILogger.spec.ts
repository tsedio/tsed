import "./DILogger.js";

import {Logger} from "@tsed/logger";
import {beforeEach} from "vitest";

import {Inject, inject, Injectable, injector} from "../../common/index.js";
import {DITest} from "./DITest.js";

describe("DILogger", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should inject logger in another service", async () => {
    @Injectable()
    class MyService {
      @Inject()
      logger: Logger;
    }

    const service = inject(MyService, {rebuild: true});

    expect(service.logger).toEqual(injector().logger);
  });
});
