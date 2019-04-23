import * as Sinon from "sinon";
import {RequestLogger} from "../../../src/mvc";

describe("RequestLogger", () => {
  it("should create a new Context and log all", () => {
    const logger = {
      info: Sinon.stub(),
      debug: Sinon.stub(),
      warn: Sinon.stub(),
      error: Sinon.stub(),
      trace: Sinon.stub()
    };

    const requestLogger = new RequestLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      url: "/url",
      ignoreUrlPatterns: ["/admin"],
      minimalRequestPicker: (o: any) => ({...o, "minimal": "minimal"}),
      completeRequestPicker: (o: any) => ({...o, "complete": "complete"})
    });

    Sinon.stub(requestLogger as any, "getDuration").returns(1);

    // WHEN
    requestLogger.debug({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info("message");
    requestLogger.warn({test: "test"});
    requestLogger.error({test: "test"});
    requestLogger.trace({test: "test"});

    requestLogger.flush();

    // THEN
    logger.info.should.have.been.calledWithExactly({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date)
    });
    logger.info.should.have.been.calledWithExactly({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      message: "message",
      time: Sinon.match.instanceOf(Date)
    });
    logger.debug.should.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date)
    });
    logger.warn.should.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date)
    });
    logger.error.should.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date)
    });
    logger.trace.should.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date)
    });
  });
  it("should create a new Context and log nothing when pattern match with url", () => {
    const logger = {
      info: Sinon.stub(),
      debug: Sinon.stub(),
      warn: Sinon.stub(),
      error: Sinon.stub(),
      trace: Sinon.stub()
    };

    const requestLogger = new RequestLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      url: "/admin",
      ignoreUrlPatterns: ["/admin"],
      minimalRequestPicker: (o: any) => ({...o, "minimal": "minimal"}),
      completeRequestPicker: (o: any) => ({...o, "complete": "complete"})
    });

    Sinon.stub(requestLogger as any, "getDuration").returns(1);

    // WHEN
    requestLogger.info({test: "test"});
    requestLogger.flush();

    // THEN
    return logger.info.should.not.have.been.called;
  });
});
