import {ContextLogger} from "./ContextLogger.js";

function getIgnoreLogFixture(ignore: string[], url: string) {
  const ignoreReg = ignore.map((pattern: string | RegExp) => (typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern));
  return (ignore: boolean, data: any) => {
    return !!ignoreReg.find((reg) => !!url.match(reg));
  };
}

describe("ContextLogger", () => {
  it("should create a new Context and log all", () => {
    const logger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      trace: vi.fn()
    };

    const contextLogger = new ContextLogger({
      event: {
        request: {},
        response: {}
      },
      logger,
      id: "id",
      dateStart: new Date("2019-01-01")
    });

    contextLogger.alterIgnoreLog(getIgnoreLogFixture(["/admin"], "/"));
    contextLogger.alterLog((o: any, level: "debug" | "info" | "warn" | "error" | "off" | "all", withRequest: boolean) => {
      switch (level) {
        case "info":
          return {...o, minimal: "minimal"};
        default:
          return {...o, complete: "complete"};
      }
    });

    vi.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.debug({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info("message");
    contextLogger.warn({test: "test"});
    contextLogger.error({test: "test"});
    contextLogger.fatal({test: "test"});
    contextLogger.trace({test: "test"});

    contextLogger.flush();

    // THEN
    expect(logger.info).toHaveBeenCalledWith({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.info).toHaveBeenCalledWith({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      message: "message",
      time: expect.any(Date)
    });
    expect(logger.debug).toHaveBeenCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.warn).toHaveBeenCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.error).toHaveBeenCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.fatal).toHaveBeenCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.trace).toHaveBeenCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
  });
  it("should create a new Context and log all (with minimalRequestPicker)", () => {
    const logger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      trace: vi.fn()
    };

    const contextLogger = new ContextLogger({
      event: {
        request: {},
        response: {}
      },
      logger,
      id: "id",
      startDate: new Date("2019-01-01")
    });

    contextLogger.alterIgnoreLog(getIgnoreLogFixture(["/admin"], "/url"));

    vi.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.debug({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info("message");
    contextLogger.warn({test: "test"});
    contextLogger.error({test: "test"});
    contextLogger.trace({test: "test"});

    contextLogger.flush();

    // THEN
    expect(logger.info).toHaveBeenCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.info).toHaveBeenCalledWith({
      duration: 1,
      reqId: "id",
      message: "message",
      time: expect.any(Date)
    });
    expect(logger.debug).toHaveBeenCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.warn).toHaveBeenCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.error).toHaveBeenCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.trace).toHaveBeenCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
  });
  it("should create a new Context and log nothing when pattern match with url", () => {
    const logger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      trace: vi.fn()
    };

    const contextLogger = new ContextLogger({
      logger,
      event: {
        request: {},
        response: {}
      },
      id: "id",
      startDate: new Date("2019-01-01"),
      additionalProps: {
        url: "/"
      }
    });

    contextLogger.alterIgnoreLog(getIgnoreLogFixture(["/admin"], "/admin"));

    vi.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.info({test: "test"});
    contextLogger.flush();

    // THEN
    return expect(logger.info).not.toHaveBeenCalled();
  });
  it("should create a new Context and flush log when maxStackSize is reached", () => {
    const logger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      trace: vi.fn()
    };

    const contextLogger = new ContextLogger({
      logger,
      event: {
        request: {},
        response: {}
      },
      id: "id",
      startDate: new Date("2019-01-01"),
      maxStackSize: 2
    });

    contextLogger.maxStackSize = 2;

    vi.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.info({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info({test: "test"});

    // THEN
    return expect(logger.info).toHaveBeenCalledTimes(3);
  });
  it("should do nothing when the log level is off", () => {
    const logger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      trace: vi.fn()
    };

    const contextLogger = new ContextLogger({
      event: {
        request: {},
        response: {}
      },
      logger,
      id: "id",
      dateStart: new Date("2019-01-01"),
      level: "off"
    });

    vi.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.debug({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info("message");
    contextLogger.warn({test: "test"});
    contextLogger.error({test: "test"});
    contextLogger.trace({test: "test"});

    contextLogger.flush();

    // THEN
    expect(logger.info).not.toHaveBeenCalled();
  });
});
