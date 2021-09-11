import {ParamMetadata, ParamTypes, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {ParseExpressionPipe} from "./ParseExpressionPipe";

const sandbox = Sinon.createSandbox();
describe("ParseExpressionPipe", () => {
  beforeEach(PlatformTest.create);
  beforeEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });
  it(
    "should parse expression",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.REQUEST,
        dataPath: "$ctx.request"
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      const scope = {
        $ctx: {
          request: {
            test: "value"
          }
        }
      };

      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).to.deep.eq("value");
    })
  );
  it(
    "should return empty value",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.REQUEST,
        dataPath: "$ctx.request"
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      const scope = {
        $ctx: {
          request: {}
        }
      };

      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).to.deep.eq(undefined);
    })
  );
  it(
    "should parse expression (for HEADER)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "Content-Type",
        paramType: ParamTypes.HEADER,
        dataPath: "$ctx.request.headers"
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      const scope = {
        $ctx: {
          request: {
            headers: {
              "content-type": "application/json"
            }
          }
        }
      };
      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).to.deep.eq("application/json");
    })
  );
  it(
    "should return undefined when value is empty and Boolean (for QUERY)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.QUERY,
        dataPath: "$ctx.request.query"
      });
      // @ts-ignore
      param._type = Boolean;

      const scope = {
        $ctx: {
          request: {
            query: {
              test: ""
            }
          }
        }
      };

      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).to.deep.eq(undefined);
    })
  );
  it(
    "should return empty when value is empty and String (for QUERY)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.QUERY,
        dataPath: "$ctx.request.query"
      });

      const scope = {
        $ctx: {
          request: {
            query: {
              test: ""
            }
          }
        }
      };
      // @ts-ignore
      param._type = String;
      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).to.deep.eq("");
    })
  );
  it(
    "should return undefined when value is empty and Boolean (for PATH)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.PATH,
        dataPath: "$ctx.request.params"
      });
      // @ts-ignore
      param._type = Boolean;

      const scope = {
        $ctx: {
          request: {
            params: {
              test: ""
            }
          }
        }
      };
      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).to.deep.eq(undefined);
    })
  );
  it(
    "should return empty when value is empty and String (for PATH)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.PATH,
        dataPath: "$ctx.request.params"
      });
      // @ts-ignore
      param._type = String;

      const scope = {
        $ctx: {
          request: {
            params: {
              test: ""
            }
          }
        }
      };
      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).to.deep.eq("");
    })
  );
});
