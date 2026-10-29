import {DecoratorTypes} from "@tsed/core";
import {JsonParameterStore} from "@tsed/schema";
import {ParamTypes} from "../../src/index.js";
import {ParseExpressionPipe} from "./ParseExpressionPipe.js";
import {PlatformTest} from "@tsed/platform-http/testing";

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
  describe("key cache", () => {
    function createParam(expression: string, paramType: ParamTypes, dataPath: string) {
      class Test {}

      const param: any = new JsonParameterStore({
        index: 0,
        target: Test,
        propertyKey: "test",
        expression,
        paramType,
        dataPath,
        decoratorType: DecoratorTypes.PARAM
      });
      // @ts-ignore
      param._type = String;

      return param;
    }

    it("should build the key of a parameter once", async () => {
      const pipe = await PlatformTest.invoke<ParseExpressionPipe>(ParseExpressionPipe);
      // without paramType, building the key reads the "in" of the parameter
      const param = createParam("id", undefined as any, "$ctx.request.params");
      const spy = vi.spyOn(param.parameter, "get").mockReturnValue("path");

      expect(pipe.transform({$ctx: {request: {params: {id: "1"}}}} as any, param)).toEqual("1");
      expect(pipe.transform({$ctx: {request: {params: {id: "2"}}}} as any, param)).toEqual("2");
      expect(spy.mock.calls.filter(([key]) => key === "in")).toHaveLength(1);
    });

    it("should keep a key per parameter", async () => {
      const pipe = await PlatformTest.invoke<ParseExpressionPipe>(ParseExpressionPipe);
      const scope: any = {$ctx: {request: {query: {page: "2"}, headers: {"content-type": "json"}}}};
      const query = createParam("page", ParamTypes.QUERY, "$ctx.request.query");
      const header = createParam("Content-Type", ParamTypes.HEADER, "$ctx.request.headers");

      expect(pipe.transform(scope, query)).toEqual("2");
      expect(pipe.transform(scope, header)).toEqual("json");
      expect(pipe.transform(scope, query)).toEqual("2");
      expect(pipe.transform(scope, header)).toEqual("json");
    });

    it("should use the key of a subclass overriding getKey()", async () => {
      class CustomExpressionPipe extends ParseExpressionPipe {
        protected getKey() {
          return "$ctx.custom";
        }
      }

      const pipe = await PlatformTest.invoke<CustomExpressionPipe>(CustomExpressionPipe);
      const param = createParam("id", ParamTypes.PATH, "$ctx.request.params");

      expect(pipe.transform({$ctx: {custom: "value"}} as any, param)).toEqual("value");
    });
  });
});
