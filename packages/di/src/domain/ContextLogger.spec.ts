import {InjectorService, ContextLogger} from "@tsed/di";

function getIgnoreLogFixture(ignore: string[], url: string) {
  const ignoreReg = ignore.map((pattern: string | RegExp) => (typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern));
  return (ignore: boolean, data: any) => {
    return !!ignoreReg.find((reg) => !!url.match(reg));
  };
}

describe("ContextLogger", () => {
  it("should create a new Context and log all", () => {
    const logger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      trace: jest.fn()
    };

    const contextLogger = new ContextLogger({
      event: {
        request: {},
        response: {}
      },
      logger,
      id: "id",
      dateStart: new Date("2019-01-01"),
      injector: new InjectorService()
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

    jest.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

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
    expect(logger.info).toBeCalledWith({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.info).toBeCalledWith({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      message: "message",
      time: expect.any(Date)
    });
    expect(logger.debug).toBeCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.warn).toBeCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.error).toBeCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.fatal).toBeCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.trace).toBeCalledWith({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
  });
  it("should create a new Context and log all (with minimalRequestPicker)", () => {
    const logger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      trace: jest.fn()
    };

    const contextLogger = new ContextLogger({
      event: {
        request: {},
        response: {}
      },
      logger,
      id: "id",
      startDate: new Date("2019-01-01"),
      injector: new InjectorService()
    });

    contextLogger.alterIgnoreLog(getIgnoreLogFixture(["/admin"], "/url"));

    jest.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.debug({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info("message");
    contextLogger.warn({test: "test"});
    contextLogger.error({test: "test"});
    contextLogger.trace({test: "test"});

    contextLogger.flush();

    // THEN
    expect(logger.info).toBeCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.info).toBeCalledWith({
      duration: 1,
      reqId: "id",
      message: "message",
      time: expect.any(Date)
    });
    expect(logger.debug).toBeCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.warn).toBeCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.error).toBeCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
    expect(logger.trace).toBeCalledWith({
      duration: 1,
      reqId: "id",
      test: "test",
      time: expect.any(Date)
    });
  });
  it("should create a new Context and log nothing when pattern match with url", () => {
    const logger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      trace: jest.fn()
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
      },
      injector: new InjectorService()
    });

    contextLogger.alterIgnoreLog(getIgnoreLogFixture(["/admin"], "/admin"));

    jest.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.info({test: "test"});
    contextLogger.flush();

    // THEN
    return expect(logger.info).not.toBeCalled();
  });
  it("should create a new Context and flush log when maxStackSize is reached", () => {
    const logger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      trace: jest.fn()
    };

    const contextLogger = new ContextLogger({
      logger,
      event: {
        request: {},
        response: {}
      },
      id: "id",
      startDate: new Date("2019-01-01"),
      maxStackSize: 2,
      injector: new InjectorService()
    });

    contextLogger.maxStackSize = 2;

    jest.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.info({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info({test: "test"});

    // THEN
    return expect(logger.info).toBeCalledTimes(3);
  });
  it("should do nothing when the log level is off", () => {
    const logger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      trace: jest.fn()
    };

    const contextLogger = new ContextLogger({
      event: {
        request: {},
        response: {}
      },
      logger,
      id: "id",
      dateStart: new Date("2019-01-01"),
      injector: new InjectorService(),
      level: "off"
    });

    jest.spyOn(contextLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    contextLogger.debug({test: "test"});
    contextLogger.info({test: "test"});
    contextLogger.info("message");
    contextLogger.warn({test: "test"});
    contextLogger.error({test: "test"});
    contextLogger.trace({test: "test"});

    contextLogger.flush();

    // THEN
    expect(logger.info).not.toBeCalled();
  });
});
