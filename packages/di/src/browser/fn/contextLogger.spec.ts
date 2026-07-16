import {Injectable, inject} from "../../common/index.js";
import {ContextLogger} from "../../common/domain/ContextLogger.js";
import {DITest} from "../../node/services/DITest.js";
import {Logger} from "@tsed/logger";
import {beforeEach} from "vitest";
import {context} from "../fn/context.js";
import {contextLogger} from "./contextLogger.js";
import {logger} from "../../common/fn/logger.js";
import {runInContext} from "../utils/asyncHookContext.js";

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
