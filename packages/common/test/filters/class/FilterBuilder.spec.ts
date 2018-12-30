import {InjectorService} from "@tsed/di";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {BadRequest} from "ts-httpexceptions/lib/clientErrors/BadRequest";
import {ConverterService} from "../../../src/converters";
import {FilterPreHandlers, ValidationService} from "../../../src/filters";
import {FilterBuilder} from "../../../src/filters/class/FilterBuilder";
import {EXPRESS_RESPONSE} from "../../../src/filters/constants";

describe("FilterBuilder", () => {
  describe("invoke()", () => {
    describe("when the filter is known", () => {
      class Test {
      }

      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.builder = new FilterBuilder(injector);
          this.filter = {
            transform: Sinon.stub().returns("value")
          };
          this.getStub = Sinon.stub(injector, "get").returns(this.filter);
          this.result = this.builder.invoke(Test, "expression", "request", "response");
        })
      );

      after(() => {
        this.getStub.restore();
      });

      it("should call injectorService.get", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("should call instance.transform", () => {
        this.filter.transform.should.have.been.calledWithExactly("expression", "request", "response");
      });

      it("should invoke method from a filter", () => {
        expect(this.result).to.equal("value");
      });
    });

    describe("when the filter is known", () => {
      class Test {
      }

      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.builder = new FilterBuilder(injector);
          this.filter = {
            transform: Sinon.stub().returns("value")
          };
          this.getStub = Sinon.stub(injector, "get").returns(undefined);

          try {
            this.result = this.builder.invoke(Test, "expression", "request", "response");
          } catch (er) {
            this.error = er;
          }
        })
      );

      after(() => {
        this.getStub.restore();
      });

      it("should call injectorService.get", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("should invoke method from a filter", () => {
        expect(this.result).to.equal("value");
      });
    });
  });

  describe("build()", () => {
    before(
      inject([InjectorService], (injector: InjectorService) => {
        this.builder = new FilterBuilder(injector);

        this.initStub = Sinon.stub(this.builder, "initFilter");
        this.initStub.returns("filter");

        this.requiredStub = Sinon.stub(this.builder, "appendRequiredFilter");
        this.requiredStub.returns("filter2");

        this.validationStub = Sinon.stub(this.builder, "appendValidationFilter");
        this.validationStub.returns("filter3");

        this.converterStub = Sinon.stub(this.builder, "appendConverterFilter");
        this.converterStub.returns("filter4");

        this.result = this.builder.build("param");
      })
    );

    after(() => {
      this.initStub.restore();
      this.requiredStub.restore();
      this.converterStub.restore();
      this.validationStub.restore();
    });

    it("should call initFilter", () => {
      this.initStub.should.have.been.calledWithExactly("param");
    });

    it("should call appendRequiredFilter", () => {
      this.requiredStub.should.have.been.calledWithExactly("filter", "param");
    });

    it("should call appendValidationFilter", () => {
      this.validationStub.should.have.been.calledWithExactly("filter2", "param");
    });

    it("should call appendConverterFilter", () => {
      this.converterStub.should.have.been.calledWithExactly("filter3", "param");
    });

    it("should return the filter", () => {
      expect(this.result).to.eq("filter4");
    });
  });
  describe("initFilter()", () => {
    describe("when filter is a symbol", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.result = (new FilterBuilder(injector) as any).initFilter({service: EXPRESS_RESPONSE});
        })
      );
      it("should return a function", () => {
        expect(this.result).to.eq(FilterPreHandlers.get(EXPRESS_RESPONSE));
      });
    });
    describe("when filter is a class", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.param = {
            service: class {
            },
            expression: "expression"
          };

          this.builder = new FilterBuilder(injector);
          this.invokeStub = Sinon.stub(this.builder, "invoke").returns("filterValue");

          this.filter = this.builder.initFilter(this.param);
          this.result = this.filter({request: "request", response: "response"});
        })
      );

      it("should call invokeMethod", () => {
        this.invokeStub.should.have.been.calledWithExactly(this.param.service, this.param.expression, "request", "response");
      });
    });
  });
  describe("appendRequiredFilter()", () => {
    describe("when param is required", () => {
      describe("when required but empty", () => {
        before(
          inject([InjectorService], (injector: InjectorService) => {
            this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
            this.pipeStub.returns("filter2");
            this.isRequiredStub = Sinon.stub().returns(true);

            this.result = (new FilterBuilder(injector) as any).appendRequiredFilter("filter", {
              required: true,
              name: "name",
              expression: "expression",
              isRequired: this.isRequiredStub
            });
            try {
              this.pipeStub.getCall(0).args[1]("value");
            } catch (er) {
              this.error = er;
            }
          })
        );
        after(() => {
          this.pipeStub.restore();
        });
        it("should call pipe method", () => {
          this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any);
        });
        it("should return a filter wrapped", () => {
          expect(this.result).to.eq("filter2");
        });
        it("should called isRequired", () => {
          this.isRequiredStub.should.calledWithExactly("value");
        });
        it("should throw an error", () => {
          expect(this.error).to.be.instanceOf(BadRequest);
        });
      });
      describe("when required but not empty", () => {
        before(
          inject([InjectorService], (injector: InjectorService) => {
            this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
            this.pipeStub.returns("filter2");
            this.isRequiredStub = Sinon.stub().returns(false);

            this.result = (new FilterBuilder(injector) as any).appendRequiredFilter("filter", {
              required: true,
              name: "name",
              expression: "expression",
              isRequired: this.isRequiredStub
            });
            this.result2 = this.pipeStub.getCall(0).args[1]("value");
          })
        );
        after(() => {
          this.pipeStub.restore();
        });
        it("should call pipe method", () => {
          this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any);
        });
        it("should return a filter wrapped", () => {
          expect(this.result).to.eq("filter2");
        });
        it("should called isRequiredStub", () => {
          this.isRequiredStub.should.calledWithExactly("value");
        });
        it("should return a value", () => {
          expect(this.result2).to.eq("value");
        });
      });
    });
    describe("when param isn't required", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");

          this.result = (new FilterBuilder(injector) as any).appendRequiredFilter("filter", {
            required: false
          });
        })
      );
      after(() => {
        this.pipeStub.restore();
      });
      it("should not have been called pipe method", () => {
        return this.pipeStub.should.not.be.called;
      });
      it("should return a filter wrapped", () => {
        expect(this.result).to.eq("filter");
      });
    });
  });
  describe("appendValidationFilter()", () => {
    describe("when use validation", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
          this.pipeStub.returns("filter2");

          this.validationStub = {
            validate: Sinon.stub()
          };

          this.injectorStub = Sinon.stub(injector, "get");
          this.injectorStub.returns(this.validationStub);

          this.result = (new FilterBuilder(injector) as any).appendValidationFilter("filter", {
            useValidation: true,
            type: "type",
            collectionType: "collection"
          });

          this.pipeResult = this.pipeStub.getCall(0).args[1]("value");
        })
      );
      after(() => {
        this.injectorStub.restore();
        this.pipeStub.restore();
      });
      it("should call pipe method", () => {
        this.pipeStub.should.have.been.calledWithExactly("filter", Sinon.match.any);
      });
      it("should call injector.get method", () => {
        this.injectorStub.should.be.calledWithExactly(ValidationService);
      });
      it("should return a filter wrapped", () => {
        expect(this.result).to.eq("filter2");
      });

      it("should call function with wrapped validation method", () => {
        this.validationStub.validate.should.have.been.calledWithExactly("value", "type", "collection");
      });

      it("should return the value", () => {
        expect(this.pipeResult).to.eq("value");
      });
    });

    describe("when use validation and there have an error", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
          this.pipeStub.returns("filter2");

          this.validationStub = {
            validate() {
              throw new Error("Test");
            }
          };

          this.injectorStub = Sinon.stub(injector, "get");
          this.injectorStub.returns(this.validationStub);

          this.result = (new FilterBuilder(injector) as any).appendValidationFilter("filter", {
            useValidation: true,
            type: "type",
            collectionType: "collection",
            name: "name",
            expression: "expression"
          });

          try {
            this.pipeResult = this.pipeStub.getCall(0).args[1]("value");
          } catch (er) {
            this.error = er;
          }
        })
      );
      after(() => {
        this.injectorStub.restore();
        this.pipeStub.restore();
      });

      it("should throw an error", () => {
        expect(this.error.message).to.equal("Bad request on parameter \"request.name.expression\".\nTest");
      });
    });

    describe("when use validation", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
          this.pipeStub.returns("filter2");

          this.validationStub = {
            validate: Sinon.stub()
          };

          this.injectorStub = Sinon.stub(injector, "get");
          this.injectorStub.returns(this.validationStub);

          this.result = (new FilterBuilder(injector) as any).appendValidationFilter("filter", {
            useValidation: true,
            type: "type",
            collectionType: "collection"
          });

          this.pipeResult = this.pipeStub.getCall(0).args[1]("value");
        })
      );
      after(() => {
        this.injectorStub.restore();
        this.pipeStub.restore();
      });
      it("should call pipe method", () => {
        this.pipeStub.should.have.been.calledWithExactly("filter", Sinon.match.any);
      });
      it("should call injector.get method", () => {
        this.injectorStub.should.be.calledWithExactly(ValidationService);
      });
      it("should return a filter wrapped", () => {
        expect(this.result).to.eq("filter2");
      });

      it("should call function with wrapped validation method", () => {
        this.validationStub.validate.should.have.been.calledWithExactly("value", "type", "collection");
      });

      it("should return the value", () => {
        expect(this.pipeResult).to.eq("value");
      });
    });

    describe("when didn't use validation", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
          this.pipeStub.returns("filter2");

          this.injectorStub = Sinon.stub(injector, "get");
          this.injectorStub.returns({
            validate: () => {
            }
          });

          this.result = (new FilterBuilder(injector) as any).appendValidationFilter("filter", {
            useValidation: false,
            type: "type",
            collectionType: "collection"
          });
        })
      );
      after(() => {
        this.injectorStub.restore();
        this.pipeStub.restore();
      });
      it("should not have been called pipe method", () => {
        return this.pipeStub.should.not.be.called;
      });
      it("shouldn't have called injector.get method", () => {
        return this.injectorStub.should.not.be.called;
      });
      it("should return a filter wrapped", () => {
        expect(this.result).to.eq("filter");
      });
    });
  });
  describe("appendConverterFilter()", () => {
    describe("when use converter", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
          this.pipeStub.returns("filter2");

          this.injectorStub = Sinon.stub(injector, "get");
          this.injectorStub.returns({
            deserialize: () => {
            }
          });

          this.result = (new FilterBuilder(injector) as any).appendConverterFilter("filter", {
            useConverter: true,
            type: "type",
            collectionType: "collection"
          });
        })
      );
      after(() => {
        this.injectorStub.restore();
        this.pipeStub.restore();
      });
      it("should call pipe method", () => {
        this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any, "collection", "type");
      });
      it("should call injector.get method", () => {
        this.injectorStub.should.be.calledWithExactly(ConverterService);
      });
      it("should return a filter wrapped", () => {
        expect(this.result).to.eq("filter2");
      });
    });
    describe("when didn't use converter", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
          this.pipeStub.returns("filter2");

          this.injectorStub = Sinon.stub(injector, "get");
          this.injectorStub.returns({
            deserialize: () => {
            }
          });

          this.result = (new FilterBuilder(injector) as any).appendConverterFilter("filter", {
            useValidation: false,
            type: "type",
            collectionType: "collection"
          });
        })
      );
      after(() => {
        this.injectorStub.restore();
        this.pipeStub.restore();
      });
      it("should not have been called pipe method", () => {
        return this.pipeStub.should.not.be.called;
      });
      it("shouldn't have called injector.get method", () => {
        return this.injectorStub.should.not.be.called;
      });
      it("should return a filter wrapped", () => {
        expect(this.result).to.eq("filter");
      });
    });
  });
  describe("pipe()", () => {
    before(() => {
      this.result = (FilterBuilder as any).pipe(
        (v: any) => `filter1(${v})`,
        (v: any, ...args: any[]) => `filter2(${v},${args.join(",")})`,
        "arg1",
        "arg2"
      );
    });
    it("should return a function", () => {
      this.result.should.be.a("function");
    });

    it("should return the result of pipe", () => {
      this.result("value").should.be.eq("filter2(filter1(value),arg1,arg2)");
    });
  });
});
