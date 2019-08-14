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
    it("should return value from custom filter (legacy)", inject([InjectorService], async (injector: InjectorService) => {
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
  });
  //
  // describe("invoke()", () => {
  //   describe("when the filter is known", () => {
  //     class Test {
  //     }
  //
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.builder = new ParamBuilder(injector);
  //         this.filter = {
  //           transform: Sinon.stub().returns("value")
  //         };
  //         this.getStub = Sinon.stub(injector, "get").returns(this.filter);
  //         this.result = this.builder.invoke(Test, "expression", "request", "response");
  //       })
  //     );
  //
  //     after(() => {
  //       this.getStub.restore();
  //     });
  //
  //     it("should call injectorService.get", () => {
  //       this.getStub.should.have.been.calledWithExactly(Test);
  //     });
  //
  //     it("should call instance.transform", () => {
  //       this.filter.transform.should.have.been.calledWithExactly("expression", "request", "response");
  //     });
  //
  //     it("should invoke method from a filter", () => {
  //       expect(this.result).to.equal("value");
  //     });
  //   });
  //
  //   describe("when the filter is known", () => {
  //     class Test {
  //     }
  //
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.builder = new ParamBuilder(injector);
  //         this.filter = {
  //           transform: Sinon.stub().returns("value")
  //         };
  //         this.getStub = Sinon.stub(injector, "get").returns(undefined);
  //
  //         try {
  //           this.result = this.builder.invoke(Test, "expression", "request", "response");
  //         } catch (er) {
  //           this.error = er;
  //         }
  //       })
  //     );
  //
  //     after(() => {
  //       this.getStub.restore();
  //     });
  //
  //     it("should call injectorService.get", () => {
  //       this.getStub.should.have.been.calledWithExactly(Test);
  //     });
  //
  //     it("should invoke method from a filter", () => {
  //       expect(this.result).to.equal("value");
  //     });
  //   });
  // });
  //
  // describe("build()", () => {
  //   before(
  //     inject([InjectorService], (injector: InjectorService) => {
  //       this.builder = new ParamBuilder(injector);
  //
  //       this.initStub = Sinon.stub(this.builder, "initFilter");
  //       this.initStub.returns("filter");
  //
  //       this.requiredStub = Sinon.stub(this.builder, "appendRequiredFilter");
  //       this.requiredStub.returns("filter2");
  //
  //       this.validationStub = Sinon.stub(this.builder, "appendValidationFilter");
  //       this.validationStub.returns("filter3");
  //
  //       this.converterStub = Sinon.stub(this.builder, "appendConverterFilter");
  //       this.converterStub.returns("filter4");
  //
  //       this.result = this.builder.build("param");
  //     })
  //   );
  //
  //   after(() => {
  //     this.initStub.restore();
  //     this.requiredStub.restore();
  //     this.converterStub.restore();
  //     this.validationStub.restore();
  //   });
  //
  //   it("should call initFilter", () => {
  //     this.initStub.should.have.been.calledWithExactly("param");
  //   });
  //
  //   it("should call appendRequiredFilter", () => {
  //     this.requiredStub.should.have.been.calledWithExactly("filter", "param");
  //   });
  //
  //   it("should call appendValidationFilter", () => {
  //     this.validationStub.should.have.been.calledWithExactly("filter2", "param");
  //   });
  //
  //   it("should call appendConverterFilter", () => {
  //     this.converterStub.should.have.been.calledWithExactly("filter3", "param");
  //   });
  //
  //   it("should return the filter", () => {
  //     expect(this.result).to.eq("filter4");
  //   });
  // });
  // describe("initFilter()", () => {
  //   describe("when filter is a symbol", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.result = (new ParamBuilder(injector) as any).initFilter({service: ParamTypes.RESPONSE});
  //       })
  //     );
  //     it("should return a function", () => {
  //       expect(this.result).to.eq(FilterPreHandlers.get(ParamTypes.RESPONSE));
  //     });
  //   });
  //   describe("when filter is a class", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.param = {
  //           service: class {
  //           },
  //           expression: "expression"
  //         };
  //
  //         this.builder = new ParamBuilder(injector);
  //         this.invokeStub = Sinon.stub(this.builder, "invoke").returns("filterValue");
  //
  //         this.filter = this.builder.initFilter(this.param);
  //         this.result = this.filter({request: "request", response: "response"});
  //       })
  //     );
  //
  //     it("should call invokeMethod", () => {
  //       this.invokeStub.should.have.been.calledWithExactly(this.param.service, this.param.expression, "request", "response");
  //     });
  //   });
  // });
  // describe("appendRequiredFilter()", () => {
  //   describe("when param is required", () => {
  //     describe("when required but empty", () => {
  //       before(
  //         inject([InjectorService], (injector: InjectorService) => {
  //           this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //           this.pipeStub.returns("filter2");
  //           this.isRequiredStub = Sinon.stub().returns(true);
  //
  //           this.result = (new ParamBuilder(injector) as any).appendRequiredFilter("filter", {
  //             required: true,
  //             name: "name",
  //             expression: "expression",
  //             isRequired: this.isRequiredStub
  //           });
  //           try {
  //             this.pipeStub.getCall(0).args[1]("value");
  //           } catch (er) {
  //             this.error = er;
  //           }
  //         })
  //       );
  //       after(() => {
  //         this.pipeStub.restore();
  //       });
  //       it("should call pipe method", () => {
  //         this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any);
  //       });
  //       it("should return a filter wrapped", () => {
  //         expect(this.result).to.eq("filter2");
  //       });
  //       it("should called isRequired", () => {
  //         this.isRequiredStub.should.calledWithExactly("value");
  //       });
  //       it("should throw an error", () => {
  //         expect(this.error).to.be.instanceOf(BadRequest);
  //       });
  //     });
  //     describe("when required but not empty", () => {
  //       before(
  //         inject([InjectorService], (injector: InjectorService) => {
  //           this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //           this.pipeStub.returns("filter2");
  //           this.isRequiredStub = Sinon.stub().returns(false);
  //
  //           this.result = (new ParamBuilder(injector) as any).appendRequiredFilter("filter", {
  //             required: true,
  //             name: "name",
  //             expression: "expression",
  //             isRequired: this.isRequiredStub
  //           });
  //           this.result2 = this.pipeStub.getCall(0).args[1]("value");
  //         })
  //       );
  //       after(() => {
  //         this.pipeStub.restore();
  //       });
  //       it("should call pipe method", () => {
  //         this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any);
  //       });
  //       it("should return a filter wrapped", () => {
  //         expect(this.result).to.eq("filter2");
  //       });
  //       it("should called isRequiredStub", () => {
  //         this.isRequiredStub.should.calledWithExactly("value");
  //       });
  //       it("should return a value", () => {
  //         expect(this.result2).to.eq("value");
  //       });
  //     });
  //   });
  //   describe("when param isn't required", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //
  //         this.result = (new ParamBuilder(injector) as any).appendRequiredFilter("filter", {
  //           required: false
  //         });
  //       })
  //     );
  //     after(() => {
  //       this.pipeStub.restore();
  //     });
  //     it("should not have been called pipe method", () => {
  //       return this.pipeStub.should.not.be.called;
  //     });
  //     it("should return a filter wrapped", () => {
  //       expect(this.result).to.eq("filter");
  //     });
  //   });
  // });
  // describe("appendValidationFilter()", () => {
  //   describe("when use validation", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //         this.pipeStub.returns("filter2");
  //
  //         this.validationStub = {
  //           validate: Sinon.stub()
  //         };
  //
  //         this.injectorStub = Sinon.stub(injector, "get");
  //         this.injectorStub.returns(this.validationStub);
  //
  //         this.result = (new ParamBuilder(injector) as any).appendValidationFilter("filter", {
  //           useValidation: true,
  //           type: "type",
  //           collectionType: "collection"
  //         });
  //
  //         this.pipeResult = this.pipeStub.getCall(0).args[1]("value");
  //       })
  //     );
  //     after(() => {
  //       this.injectorStub.restore();
  //       this.pipeStub.restore();
  //     });
  //     it("should call pipe method", () => {
  //       this.pipeStub.should.have.been.calledWithExactly("filter", Sinon.match.any);
  //     });
  //     it("should call injector.get method", () => {
  //       this.injectorStub.should.be.calledWithExactly(ValidationService);
  //     });
  //     it("should return a filter wrapped", () => {
  //       expect(this.result).to.eq("filter2");
  //     });
  //
  //     it("should call function with wrapped validation method", () => {
  //       this.validationStub.validate.should.have.been.calledWithExactly("value", "type", "collection");
  //     });
  //
  //     it("should return the value", () => {
  //       expect(this.pipeResult).to.eq("value");
  //     });
  //   });
  //
  //   describe("when use validation and there have an error", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //         this.pipeStub.returns("filter2");
  //
  //         this.validationStub = {
  //           validate() {
  //             throw new Error("Test");
  //           }
  //         };
  //
  //         this.injectorStub = Sinon.stub(injector, "get");
  //         this.injectorStub.returns(this.validationStub);
  //
  //         this.result = (new ParamBuilder(injector) as any).appendValidationFilter("filter", {
  //           useValidation: true,
  //           type: "type",
  //           collectionType: "collection",
  //           service: "name",
  //           expression: "expression"
  //         });
  //
  //         try {
  //           this.pipeResult = this.pipeStub.getCall(0).args[1]("value");
  //         } catch (er) {
  //           this.error = er;
  //         }
  //       })
  //     );
  //     after(() => {
  //       this.injectorStub.restore();
  //       this.pipeStub.restore();
  //     });
  //
  //     it("should throw an error", () => {
  //       expect(this.error.message).to.equal("Bad request on parameter \"request.name.expression\".\nTest");
  //     });
  //   });
  //
  //   describe("when use validation", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //         this.pipeStub.returns("filter2");
  //
  //         this.validationStub = {
  //           validate: Sinon.stub()
  //         };
  //
  //         this.injectorStub = Sinon.stub(injector, "get");
  //         this.injectorStub.returns(this.validationStub);
  //
  //         this.result = (new ParamBuilder(injector) as any).appendValidationFilter("filter", {
  //           useValidation: true,
  //           type: "type",
  //           collectionType: "collection"
  //         });
  //
  //         this.pipeResult = this.pipeStub.getCall(0).args[1]("value");
  //       })
  //     );
  //     after(() => {
  //       this.injectorStub.restore();
  //       this.pipeStub.restore();
  //     });
  //     it("should call pipe method", () => {
  //       this.pipeStub.should.have.been.calledWithExactly("filter", Sinon.match.any);
  //     });
  //     it("should call injector.get method", () => {
  //       this.injectorStub.should.be.calledWithExactly(ValidationService);
  //     });
  //     it("should return a filter wrapped", () => {
  //       expect(this.result).to.eq("filter2");
  //     });
  //
  //     it("should call function with wrapped validation method", () => {
  //       this.validationStub.validate.should.have.been.calledWithExactly("value", "type", "collection");
  //     });
  //
  //     it("should return the value", () => {
  //       expect(this.pipeResult).to.eq("value");
  //     });
  //   });
  //
  //   describe("when didn't use validation", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //         this.pipeStub.returns("filter2");
  //
  //         this.injectorStub = Sinon.stub(injector, "get");
  //         this.injectorStub.returns({
  //           validate: () => {
  //           }
  //         });
  //
  //         this.result = (new ParamBuilder(injector) as any).appendValidationFilter("filter", {
  //           useValidation: false,
  //           type: "type",
  //           collectionType: "collection"
  //         });
  //       })
  //     );
  //     after(() => {
  //       this.injectorStub.restore();
  //       this.pipeStub.restore();
  //     });
  //     it("should not have been called pipe method", () => {
  //       return this.pipeStub.should.not.be.called;
  //     });
  //     it("shouldn't have called injector.get method", () => {
  //       return this.injectorStub.should.not.be.called;
  //     });
  //     it("should return a filter wrapped", () => {
  //       expect(this.result).to.eq("filter");
  //     });
  //   });
  // });
  // describe("appendConverterFilter()", () => {
  //   describe("when use converter", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //         this.pipeStub.returns("filter2");
  //
  //         this.injectorStub = Sinon.stub(injector, "get");
  //         this.injectorStub.returns({
  //           deserialize: () => {
  //           }
  //         });
  //
  //         this.result = (new ParamBuilder(injector) as any).appendConverterFilter("filter", {
  //           useConverter: true,
  //           type: "type",
  //           collectionType: "collection"
  //         });
  //       })
  //     );
  //     after(() => {
  //       this.injectorStub.restore();
  //       this.pipeStub.restore();
  //     });
  //     it("should call pipe method", () => {
  //       this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any, "collection", "type");
  //     });
  //     it("should call injector.get method", () => {
  //       this.injectorStub.should.be.calledWithExactly(ConverterService);
  //     });
  //     it("should return a filter wrapped", () => {
  //       expect(this.result).to.eq("filter2");
  //     });
  //   });
  //   describe("when didn't use converter", () => {
  //     before(
  //       inject([InjectorService], (injector: InjectorService) => {
  //         this.pipeStub = Sinon.stub(ParamBuilder as any, "pipe");
  //         this.pipeStub.returns("filter2");
  //
  //         this.injectorStub = Sinon.stub(injector, "get");
  //         this.injectorStub.returns({
  //           deserialize: () => {
  //           }
  //         });
  //
  //         this.result = (new ParamBuilder(injector) as any).appendConverterFilter("filter", {
  //           useValidation: false,
  //           type: "type",
  //           collectionType: "collection"
  //         });
  //       })
  //     );
  //     after(() => {
  //       this.injectorStub.restore();
  //       this.pipeStub.restore();
  //     });
  //     it("should not have been called pipe method", () => {
  //       return this.pipeStub.should.not.be.called;
  //     });
  //     it("shouldn't have called injector.get method", () => {
  //       return this.injectorStub.should.not.be.called;
  //     });
  //     it("should return a filter wrapped", () => {
  //       expect(this.result).to.eq("filter");
  //     });
  //   });
  // });
});
