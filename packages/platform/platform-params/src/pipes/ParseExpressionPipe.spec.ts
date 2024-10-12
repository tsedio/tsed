import {DecoratorTypes} from "@tsed/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import {JsonParameterStore} from "@tsed/schema";

import {ParamTypes} from "../../src/index.js";
import {ParseExpressionPipe} from "./ParseExpressionPipe.js";

describe("ParseExpressionPipe", () => {
  beforeEach(PlatformTest.create);
  beforeEach(PlatformTest.reset);
  it(
    "should parse expression",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param: any = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.REQUEST,
        dataPath: "$ctx.request",
        decoratorType: DecoratorTypes.PARAM
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      const scope: any = {
        $ctx: {
          request: {
            test: "value"
          }
        }
      };

      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).toEqual("value");
    })
  );
  it(
    "should return empty value",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param: any = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.REQUEST,
        dataPath: "$ctx.request",
        decoratorType: DecoratorTypes.PARAM
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      const scope: any = {
        $ctx: {
          request: {}
        }
      };

      // WHEN
      const value = pipe.transform(scope, param);

      expect(value).toEqual(undefined);
    })
  );
  it(
    "should parse expression (for HEADER)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param: any = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "Content-Type",
        paramType: ParamTypes.HEADER,
        dataPath: "$ctx.request.headers",
        decoratorType: DecoratorTypes.PARAM
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      const scope: any = {
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

      expect(value).toEqual("application/json");
    })
  );
  it(
    "should return undefined when value is empty and Boolean (for QUERY)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.QUERY,
        dataPath: "$ctx.request.query",
        decoratorType: DecoratorTypes.PARAM
      });
      // @ts-ignore
      param._type = Boolean;

      const scope: any = {
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

      expect(value).toEqual(undefined);
    })
  );
  it(
    "should return empty when value is empty and String (for QUERY)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.QUERY,
        dataPath: "$ctx.request.query",
        decoratorType: DecoratorTypes.PARAM
      });

      const scope: any = {
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

      expect(value).toEqual("");
    })
  );
  it(
    "should return undefined when value is empty and Boolean (for PATH)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.PATH,
        dataPath: "$ctx.request.params",
        decoratorType: DecoratorTypes.PARAM
      });
      // @ts-ignore
      param._type = Boolean;

      const scope: any = {
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

      expect(value).toEqual(undefined);
    })
  );
  it(
    "should return empty when value is empty and String (for PATH)",
    PlatformTest.inject([ParseExpressionPipe], (pipe: ParseExpressionPipe) => {
      // @ts-ignore
      class Test {}

      const param = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression: "test",
        paramType: ParamTypes.PATH,
        dataPath: "$ctx.request.params",
        decoratorType: DecoratorTypes.PARAM
      });
      // @ts-ignore
      param._type = String;

      const scope: any = {
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

      expect(value).toEqual("");
    })
  );
});
