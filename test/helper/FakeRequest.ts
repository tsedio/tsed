import * as Sinon from "sinon";
import {SinonStub} from "sinon";
import {RequestContext} from "../../packages/common/src/mvc/models/RequestContext";

export class FakeRequest {
  public url = "/";
  public method: string;
  public path: string;
  public mime: string;
  public id: number;
  /**
   *
   * @type {{test: string, obj: {test: string}}}
   */
  public cookies: any = {
    test: "testValue",
    obj: {
      test: "testValue"
    }
  };
  /**
   *
   * @type {{test: string, obj: {test: string}}}
   */
  public body: any = {
    test: "testValue",
    obj: {
      test: "testValue"
    }
  };
  /**
   *
   * @type {{test: string, obj: {test: string}}}
   */
  public query: any = {
    test: "testValue",
    obj: {
      test: "testValue"
    }
  };
  /**
   *
   * @type {{test: string, obj: {test: string}}}
   */
  public params: any = {
    test: "testValue",
    obj: {
      test: "testValue"
    }
  };
  public session: any = {
    test: "testValue",
    obj: {
      test: "testValue"
    }
  };

  public headers: any = {
    "content-type": "application/json"
  };

  public ctx: RequestContext;
  public log: {[key: string]: SinonStub};
  public isAuthenticated: SinonStub;
  public accepts: SinonStub;
  public get: SinonStub;

  [key: string]: any;

  constructor({logger, data, endpoint, sandbox = Sinon}: any = {}) {
    logger = logger || {
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      trace: sandbox.stub(),
      flush: sandbox.stub()
    };

    this.ctx = new RequestContext({
      id: "id",
      url: "url",
      logger
    });
    this.ctx.data = data;
    this.ctx.endpoint = endpoint;

    this.log = logger;

    this.isAuthenticated = sandbox.stub();
    this.accepts = sandbox.stub().callsFake((mime: string) => this.mime === mime);
    this.get = sandbox.stub().callsFake((value: any) => {
      return value ? (this.headers[value.toLowerCase()] || "headerValue") : this.headers;
    });
  }
}
