import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {$logStub} from "../../../../../test/helper/tools";
import {ServerSettingsService} from "../../../src/config";
import {LogIncomingRequestMiddleware} from "../../../src/mvc";

describe("LogIncomingRequestMiddleware", () => {
  describe("configureRequest()", () => {
    describe("when ignorePattern isn't configured", () => {
      before(
        inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
          $logStub.reset();

          this.middleware = middleware;
          Sinon.stub(this.middleware, "reqIdBuilder").returns("1");

          this.request = {};
          this.request2 = {id: "id"};
          this.middleware.configureRequest(this.request);
          this.middleware.configureRequest(this.request2);

          this.request.log.debug({custom: "c"});
          this.request.log.info({custom: "c"});
          this.request.log.warn({custom: "c"});
          this.request.log.error({custom: "c"});
          this.request.log.trace({custom: "c"});
        })
      );

      after(() => {
        this.middleware.reqIdBuilder.restore();
      });

      it("should have a id field", () => {
        this.request.id.should.be.eq("1");
        this.request2.id.should.be.eq("id");
      });

      it("should have a tsedReqStart field", () => {
        this.request.tsedReqStart.should.be.a("date");
      });

      it("should have a log.info method", () => {
        $logStub.info.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.debug method", () => {
        $logStub.debug.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.trace method", () => {
        $logStub.trace.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.error method", () => {
        $logStub.error.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.warn method", () => {
        $logStub.warn.should.be.calledWithExactly(Sinon.match.string);
      });
    });

    describe("when ignorePattern is configured", () => {
      before(
        inject([LogIncomingRequestMiddleware, ServerSettingsService], (middleware: LogIncomingRequestMiddleware) => {
          $logStub.reset();

          this.middleware = middleware;
          this.middleware.loggerSettings.ignoreUrlPatterns = ["/test"];
          Sinon.stub(this.middleware, "reqIdBuilder").returns("1");

          this.request = {url: "/test"};
          this.middleware.configureRequest(this.request);

          this.request.log.debug({custom: "c"});
          this.request.log.info({custom: "c"});
          this.request.log.warn({custom: "c"});
          this.request.log.error({custom: "c"});
          this.request.log.trace({custom: "c"});
        })
      );

      after(() => {
        this.middleware.reqIdBuilder.restore();
      });

      it("should have a id field", () => {
        this.request.id.should.be.eq("1");
      });

      it("should have a tsedReqStart field", () => {
        this.request.tsedReqStart.should.be.a("date");
      });

      it("shouldn't have a log.info method", () => {
        $logStub.info.should.not.be.called;
      });

      it("shouldn't have a log.debug method", () => {
        $logStub.debug.should.not.be.called;
      });

      it("shouldn't have a log.trace method", () => {
        $logStub.trace.should.not.be.called;
      });

      it("shouldn't have a log.error method", () => {
        $logStub.error.should.not.be.called;
      });

      it("shouldn't have a log.warn method", () => {
        $logStub.warn.should.not.be.called;
      });
    });

    describe("when ignorePattern is configured (2)", () => {
      before(
        inject([LogIncomingRequestMiddleware, ServerSettingsService], (middleware: LogIncomingRequestMiddleware) => {
          $logStub.reset();

          this.middleware = middleware;
          this.middleware.loggerSettings.ignoreUrlPatterns = ["/test"];
          Sinon.stub(this.middleware, "reqIdBuilder").returns("1");

          this.request = {url: "/rest"};
          this.middleware.configureRequest(this.request);

          this.request.log.debug({custom: "c"});
          this.request.log.info({custom: "c"});
          this.request.log.warn({custom: "c"});
          this.request.log.error({custom: "c"});
          this.request.log.trace({custom: "c"});
        })
      );

      after(() => {
        this.middleware.reqIdBuilder.restore();
      });

      it("should have a id field", () => {
        this.request.id.should.be.eq("1");
      });

      it("should have a tsedReqStart field", () => {
        this.request.tsedReqStart.should.be.a("date");
      });

      it("should have a log.info method", () => {
        $logStub.info.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.debug method", () => {
        $logStub.debug.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.trace method", () => {
        $logStub.trace.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.error method", () => {
        $logStub.error.should.be.calledWithExactly(Sinon.match.string);
      });

      it("should have a log.warn method", () => {
        $logStub.warn.should.be.calledWithExactly(Sinon.match.string);
      });
    });
  });
  describe("getDuration()", () => {
    before(
      inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
        this.middleware = middleware;
        this.request = {tsedReqStart: new Date()};
      })
    );

    it("should have a id field", () => {
      expect(this.middleware.getDuration(this.request)).to.be.a("number");
    });
  });
  describe("requestToObject()", () => {
    before(
      inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
        this.request = {
          id: "id",
          method: "method",
          originalUrl: "originalUrl",
          headers: {headers: "headers"},
          body: {body: "body"},
          query: {query: "query"},
          params: {params: "params"}
        };
        this.request2 = this.request = {
          id: "id",
          method: "method",
          url: "url",
          headers: {headers: "headers"},
          body: {body: "body"},
          query: {query: "query"},
          params: {params: "params"}
        };

        this.middleware = middleware;

        Sinon.stub(this.middleware, "getDuration").returns(2);

        this.result = this.middleware.requestToObject(this.request);
        this.result2 = this.middleware.requestToObject(this.request2);
      })
    );

    after(() => {
      this.middleware.getDuration.restore();
    });

    it("should have been called getDuration with the right parameters", () => {
      this.middleware.getDuration.should.be.calledWithExactly(this.request);
    });

    it("should return an object from the request", () => {
      this.result.should.be.deep.eq({
        body: {
          body: "body"
        },
        duration: 2,
        headers: {
          headers: "headers"
        },
        method: "method",
        params: {
          params: "params"
        },
        query: {
          query: "query"
        },
        reqId: "id",
        url: "url"
      });
    });
    it("should return an object from the request", () => {
      this.result2.should.be.deep.eq({
        body: {
          body: "body"
        },
        duration: 2,
        headers: {
          headers: "headers"
        },
        method: "method",
        params: {
          params: "params"
        },
        query: {
          query: "query"
        },
        reqId: "id",
        url: "url"
      });
    });
  });
  describe("minimalRequestPicker()", () => {
    before(
      inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
        this.request = {
          id: "id",
          method: "method",
          originalUrl: "originalUrl",
          headers: {headers: "headers"},
          body: {body: "body"},
          query: {query: "query"},
          params: {params: "params"}
        };
        this.request2 = this.request = {
          id: "id",
          method: "method",
          url: "url",
          headers: {headers: "headers"},
          body: {body: "body"},
          query: {query: "query"},
          params: {params: "params"}
        };

        this.middleware = middleware;

        Sinon.stub(this.middleware, "getDuration").returns(2);

        this.result = this.middleware.minimalRequestPicker(this.request);

        this.middleware.fields = ["reqId"];

        this.result2 = this.middleware.minimalRequestPicker(this.request2);
      })
    );

    after(() => {
      this.middleware.getDuration.restore();
    });

    it("should have been called getDuration with the right parameters", () => {
      this.middleware.getDuration.should.be.calledWithExactly(this.request);
    });

    it("should return an object from the request (1)", () => {
      this.result.should.be.deep.eq({
        duration: 2,
        method: "method",
        reqId: "id",
        url: "url"
      });
    });
    it("should return an object from the request (2)", () => {
      this.result2.should.be.deep.eq({
        reqId: "id"
      });
    });
  });
  describe("stringify()", () => {
    describe("when passed a string", () => {
      before(
        inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
          this.request = new FakeRequest();
          this.middleware = middleware;
          Sinon.stub(this.middleware, "getDuration").returns(2);
          const none = (req: Express.Request) => {
          };
          this.result = this.middleware.stringify(this.request, none)("message");
        })
      );

      after(() => {
        this.middleware.getDuration.restore();
      });

      it("should include string as msg property", () => {
        this.result.should.be.a("string");
        expect(JSON.parse(this.result)).to.have.property("message", "message");
      });
    });

    describe("when json fail", () => {
      before(
        inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
          this.request = new FakeRequest();
          this.middleware = middleware;
          Sinon.stub(this.middleware, "getDuration").returns(2);
          const none = (req: Express.Request) => {
          };
          this.jsonStub = Sinon.stub(JSON, "stringify");
          this.jsonStub.throws(new Error("JSON"));
          this.result = this.middleware.stringify(this.request, none)("message");
        })
      );

      after(() => {
        this.middleware.getDuration.restore();
        this.jsonStub.restore();
      });

      it("should include string as msg property", () => {
        this.result.should.be.a("string");
        expect(this.result).to.eq("");
      });
    });

    describe("when dev", () => {
      before(
        inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
          this.request = {
            id: "id",
            method: "method",
            originalUrl: "originalUrl",
            headers: {headers: "headers"},
            body: {body: "body"},
            query: {query: "query"},
            params: {params: "params"}
          };

          this.middleware = middleware;

          Sinon.stub(this.middleware, "getDuration").returns(2);
          const verbose = (req: Express.Request) => this.middleware.requestToObject(req);
          this.result = this.middleware.stringify(this.request, verbose)({scope: "scope"});
        })
      );

      after(() => {
        this.middleware.getDuration.restore();
      });
      it("should stringify the request", () => {
        this.result.should.be.a("string");
        expect(JSON.parse(this.result)).to.deep.eq({
          body: {
            body: "body"
          },
          duration: 2,
          headers: {
            headers: "headers"
          },
          method: "method",
          params: {
            params: "params"
          },
          query: {
            query: "query"
          },
          reqId: "id",
          scope: "scope",
          url: "originalUrl"
        });
      });
    });
    describe("when prod", () => {
      before(
        inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
          this.request = {
            id: "id",
            method: "method",
            originalUrl: "originalUrl",
            headers: {headers: "headers"},
            body: {body: "body"},
            query: {query: "query"},
            params: {params: "params"}
          };

          this.middleware = middleware;
          this.middleware.env = "production";
          Sinon.stub(this.middleware, "getDuration").returns(2);
          const verbose = (req: Express.Request) => this.middleware.requestToObject(req);
          this.result = this.middleware.stringify(this.request, verbose)({scope: "scope"});
        })
      );

      after(() => {
        this.middleware.getDuration.restore();
      });

      it("should stringify the request", () => {
        this.result.should.be.a("string");
        expect(JSON.parse(this.result)).to.deep.eq({
          body: {
            body: "body"
          },
          duration: 2,
          headers: {
            headers: "headers"
          },
          method: "method",
          params: {
            params: "params"
          },
          query: {
            query: "query"
          },
          reqId: "id",
          scope: "scope",
          url: "originalUrl"
        });
      });
    });
  });

  describe("cleanRequest()", () => {
    before(
      inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
        this.middleware = middleware;
        this.request = {request: "request"};
        this.middleware.configureRequest(this.request);
        this.middleware.cleanRequest(this.request);
        this.request.log.info();
        this.request.log.debug();
        this.request.log.warn();
        this.request.log.error();
        this.request.log.trace();
      })
    );

    it("should clean the request", () => {
      expect(this.request.tagId).to.eq(undefined);
      expect(this.request.id).to.eq(undefined);
      expect(this.request.tsedReqStart).to.eq(undefined);
      expect(this.request.log).to.be.an("object");
    });
  });
  describe("use()", () => {
    before(
      inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
        this.middleware = middleware;
        this.request = new FakeRequest();
        this.request.url = "/test";
        this.response = new FakeResponse();
        this.request.mime = "application/json";
        this.request.headers = {};
        this.middleware.use(this.request, this.response);
      })
    );

    it("should have been decorated request", () => {
      expect(this.request.tsedReqStart).to.be.a("date");
      expect(this.request.log).to.be.a("object");
      expect(this.request.log.info).to.be.a("function");
      expect(this.request.log.warn).to.be.a("function");
      expect(this.request.log.error).to.be.a("function");
      expect(this.request.log.trace).to.be.a("function");
      expect(this.request.log.debug).to.be.a("function");
    });
  });
  describe("onLogEnd()", () => {
    before(
      inject([LogIncomingRequestMiddleware], (middleware: LogIncomingRequestMiddleware) => {
        this.middleware = middleware;
        this.request = {
          id: "id",
          method: "method",
          originalUrl: "originalUrl",
          headers: {headers: "headers"},
          body: {body: "body"},
          query: {query: "query"},
          params: {params: "params"},
          log: {
            debug: Sinon.stub(),
            info: Sinon.stub()
          },
          getStoredData: () => "test"
        };
        this.response = {};
        Sinon.stub(this.middleware, "cleanRequest");
        this.middleware.debug = true;

        this.middleware.onLogEnd(this.request, this.response);
      })
    );
    after(() => {
      this.middleware.cleanRequest.restore();
    });

    /*it("should have been called the logger with the right parameters", () => {
            this.request.log.debug.should.be.calledWithExactly({status: undefined, data: "test"});
        });*/

    it("should clean the request object", () => {
      this.middleware.cleanRequest.should.be.calledWithExactly(this.request);
    });
  });
});
