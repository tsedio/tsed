import {expect} from "chai";
import * as Express from "express";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {Type} from "../../../../core/src/interfaces";
import {InjectorService} from "../../../../di/src";
import {inject} from "../../../../testing/src";
import {Filter, IFilter, ParamBuilder, ParamMetadata, ParamTypes} from "../../../src/mvc";


function build(injector: InjectorService, type: ParamTypes | Type<any>, {expression, required}: any = {}) {
  class Test {
    test() {
    }
  }

  const paramMetadata = new ParamMetadata({target: Test, propertyKey: "test", index: 0});
  paramMetadata.service = type;

  if (expression) {
    paramMetadata.expression = expression;
  }
  if (required) {
    paramMetadata.required = required;
  }

  const {subject, observable} = new ParamBuilder(paramMetadata).build(injector);

  return {
    subject,
    observable,
    paramMetadata,
    promise: new Promise((resolve, reject) => {
      observable.subscribe(resolve, reject);
    })
  };
}


describe("ParamBuilder", () => {
  describe("build()", () => {
    it("should return REQUEST", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.REQUEST);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq(request);
    }));
    it("should return REQUEST + expression", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      request.user = "User";

      const {subject, promise} = build(injector, ParamTypes.REQUEST, {expression: "user"});

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq("User");
    }));
    it("should return REQUEST + expression + required (success)", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise, paramMetadata} = build(injector, ParamTypes.REQUEST, {expression: "user"});

      paramMetadata.required = true;
      request.user = "user";

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq("user");
    }));
    it("should return REQUEST + expression + required (failed)", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise, paramMetadata} = build(injector, ParamTypes.REQUEST, {
        expression: "user",
        required: true
      });

      paramMetadata.required = true;

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const result: any = await promise;

      // THEN
      expect(result).to.instanceof(Error);
      expect(result.message).to.deep.eq("Bad request, parameter \"request.user\" is required.");
    }));
    it("should return RESPONSE", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.RESPONSE);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq(response);
    }));
    it("should return NEXT", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.NEXT_FN);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq(next);
    }));
    it("should return ERR", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();
      const err: any = new Error();

      const {subject, promise} = build(injector, ParamTypes.ERR);

      // WHEN
      subject.next({
        request,
        response,
        next,
        err
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq(err);
    }));
    it("should return BODY", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.BODY);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq({
        "obj": {
          "test": "testValue"
        },
        "test": "testValue"
      });
    }));
    it("should return PATH", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.PATH);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq({
        "obj": {
          "test": "testValue"
        },
        "test": "testValue"
      });
    }));
    it("should return QUERY", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.QUERY);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq({
        "obj": {
          "test": "testValue"
        },
        "test": "testValue"
      });
    }));
    it("should return HEADER", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.HEADER);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq({"content-type": "application/json"});
    }));
    it("should return HEADER + expression", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.HEADER, {expression: "Content-Type"});

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq("application/json");
    }));
    it("should return COOKIES", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.COOKIES);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq({
        "obj": {
          "test": "testValue"
        },
        "test": "testValue"
      });
    }));
    it("should return SESSION", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.SESSION);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq({
        "obj": {
          "test": "testValue"
        },
        "test": "testValue"
      });
    }));
    it("should return LOCALS", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.SESSION);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq({
        "obj": {
          "test": "testValue"
        },
        "test": "testValue"
      });
    }));
    it("should return CONTEXT", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.CONTEXT);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq(request.ctx);
    }));
    it("should return RESPONSE_DATA", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.RESPONSE_DATA);

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq(request.ctx.data);
    }));
    it("should return ENDPOINT_INFO", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, ParamTypes.ENDPOINT_INFO);

      request.ctx.endpoint = "endpoint";

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq(request.ctx.endpoint);
    }));
    it("should return value from custom filter", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      @Filter()
      class CustomFilter implements IFilter {
        transform(expression: string, request: Express.Request, response: Express.Response): any {
          return expression + " value " + request.get("content-type");
        }
      }

      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      injector.forkProvider(CustomFilter);

      const {subject, promise} = build(injector, CustomFilter, {expression: "expression"});

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const value = await promise;

      // THEN
      expect(value).to.deep.eq("expression value application/json");
    }));
    it("should return value from unknow custom filter", inject([InjectorService], async (injector: InjectorService) => {
      // GIVEN
      class CustomFilter2 implements IFilter {
        transform(expression: string, request: Express.Request, response: Express.Response): any {
          return expression + " value " + request.get("content-type");
        }
      }

      const request: any = new FakeRequest();
      const response: any = new FakeResponse();
      const next: any = Sinon.stub();

      const {subject, promise} = build(injector, CustomFilter2, {expression: "expression"});

      // WHEN
      subject.next({
        request,
        response,
        next
      } as any);

      const result: any = await promise;

      // THEN
      expect(result.message).to.deep.eq("Filter CustomFilter2 not found.");
    }));
  });
});
