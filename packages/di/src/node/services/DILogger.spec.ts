import "./DILogger.js";
import {Inject, Injectable, inject, injector} from "../../common/index.js";
import {DITest} from "./DITest.js";
import {Logger} from "@tsed/logger";
import {beforeEach} from "vitest";

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
