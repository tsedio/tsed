import {ContextLogger} from "./ContextLogger";

function getIgnoreLogFixture(ignore: string[], url: string) {
  const ignoreReg = ignore.map((pattern: string | RegExp) => (typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern));
  return () => {
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
      trace: jest.fn()
    };

    const requestLogger = new ContextLogger(logger, {
      id: "id",
      dateStart: new Date("2019-01-01"),
      ignoreLog: getIgnoreLogFixture(["/admin"], "/"),
      minimalRequestPicker: (o: any) => ({...o, minimal: "minimal"}),
      completeRequestPicker: (o: any) => ({...o, complete: "complete"})
    });

    jest.spyOn(requestLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    requestLogger.debug({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info("message");
    requestLogger.warn({test: "test"});
    requestLogger.error({test: "test"});
    requestLogger.trace({test: "test"});

    requestLogger.flush();

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

    const requestLogger = new ContextLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      ignoreLog: getIgnoreLogFixture(["/admin"], "/url")
    });

    jest.spyOn(requestLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    requestLogger.debug({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info("message");
    requestLogger.warn({test: "test"});
    requestLogger.error({test: "test"});
    requestLogger.trace({test: "test"});

    requestLogger.flush();

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

    const requestLogger = new ContextLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      ignoreLog: getIgnoreLogFixture(["/admin"], "/admin"),
      minimalRequestPicker: (o: any) => ({...o, minimal: "minimal"}),
      completeRequestPicker: (o: any) => ({...o, complete: "complete"}),
      additionalProps: {
        url: "/"
      }
    });

    jest.spyOn(requestLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    requestLogger.info({test: "test"});
    requestLogger.flush();

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

    const requestLogger = new ContextLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      url: "/admin",
      maxStackSize: 2,
      minimalRequestPicker: (o: any) => ({...o, minimal: "minimal"}),
      completeRequestPicker: (o: any) => ({...o, complete: "complete"})
    });

    jest.spyOn(requestLogger as any, "getDuration").mockReturnValue(1);

    // WHEN
    requestLogger.info({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info({test: "test"});

    // THEN
    return expect(logger.info).toBeCalledTimes(3);
  });
});
