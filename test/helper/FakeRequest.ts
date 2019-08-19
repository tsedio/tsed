import * as Sinon from "sinon";
import {SinonStatic, SinonStub} from "sinon";
import {Context} from "../../packages/common/src/mvc/models/Context";

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

  public ctx = new Context({id: "id"});
  public log: {[key: string]: SinonStub};
  public isAuthenticated: SinonStub;
  public accepts: SinonStub;
  public get: SinonStub;

  [key: string]: any;

  constructor(sandbox: SinonStatic = Sinon) {
    this.log = {
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      trace: sandbox.stub(),
      flush: sandbox.stub()
    };

    this.isAuthenticated = sandbox.stub();
    this.accepts = sandbox.stub().callsFake((mime: string) => this.mime === mime);
    this.get = sandbox.stub().callsFake((value) => {
      return value ? (this.headers[value.toLowerCase()] || "headerValue") : this.headers;
    });
  }
}
