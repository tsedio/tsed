import {Context} from "../../packages/common/src/mvc/class/Context";

export class FakeRequest {
  [key: string]: any;

  url = "/";
  method: string;
  path: string;
  mime: string;
  id: number;

  ctx = new Context({id: "id"});

  log: any = {
    debug: (scope?: any) => {
    },

    info: (scope?: any) => {
    },

    trace: (scope?: any) => {
    },

    warn: (scope?: any) => {
    },

    error: (scope?: any) => {
    }
  };
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

  public accepts = (mime: string) => this.mime === mime;

  public get(expression: any) {
    return "headerValue";
  }

  public end() {
  }
}
