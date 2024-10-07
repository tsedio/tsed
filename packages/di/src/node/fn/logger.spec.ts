import {Logger} from "@tsed/logger";
import {beforeEach} from "vitest";

import {inject, Injectable} from "../../common/index.js";
import {ContextLogger} from "../domain/ContextLogger.js";
import {context} from "../fn/context.js";
import {DITest} from "../services/DITest.js";
import {runInContext} from "../utils/asyncHookContext.js";
import {contextLogger, logger} from "./logger.js";

describe("DILogger", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should inject logger in another service (decorator less)", async () => {
    @Injectable()
    class MyService {
      logger = logger();
    }

    const service = inject(MyService, {rebuild: true});

    expect(service.logger).toBeInstanceOf(Logger);
  });

  it("should inject context logger in another service", async () => {
    @Injectable()
    class MyService {
      get logger() {
        return contextLogger();
      }
    }

    const service = inject(MyService, {rebuild: true});

    expect(service.logger).toBeInstanceOf(ContextLogger);

    const $ctx = context();

    await runInContext($ctx, () => {
      expect(service.logger).toEqual(context().logger);
    });

    expect(service.logger).not.toEqual(context().logger);
  });
});
