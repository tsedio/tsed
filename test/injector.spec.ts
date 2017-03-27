import * as Chai from "chai";
import InjectorService from '../src/services/injector';
import {inject} from '../src/testing/inject';
import {Inject} from "../src/decorators/inject";

const expect: Chai.ExpectStatic = Chai.expect;

interface myFactory {
  method(): string;
}

const myFactory = function() {
    this.method = function(){
        return "test";
    }
};

class InvokeMethodTest {
    constructor(private t) {

    }

    @Inject()
    method(injectorService: InjectorService) {
        expect(this.t).not.to.be.undefined;
        return injectorService;
    }
}

describe('InjectorService :', () => {

    describe('InjectorService.factory()', () => {

       it('should create new Factory', () => {

           InjectorService.factory(myFactory, new myFactory);

       });

       it('should inject the Factory', inject([myFactory], (myFactory: myFactory) => {

           expect(myFactory.method()).to.equal('test');

       }));

    });

    describe('InjectorService.use()', () => {

        it('should create new entry', () => {

            InjectorService.set(myFactory, new myFactory);

        });

        it('should inject the Factory', inject([myFactory], (myFactory: myFactory) => {

            expect(myFactory.method()).to.equal('test');

        }));

    });

    describe('new InjectorService()', () => {

        describe('injectorService.get()', () => {

            it('should get a service', inject([InjectorService], (injectorService: InjectorService) => {

                expect(injectorService.get(InjectorService)).to.be.an.instanceof(InjectorService);

            }));

            it('should has the service', inject([InjectorService], (injectorService: InjectorService) => {

                expect(injectorService.has(InjectorService)).to.be.true;

            }));

        });


        describe('injectorService.invoke()', () => {

            it('should invoke a function constructor', inject([InjectorService], (injectorService: InjectorService) => {

                const fnInvokable = function(injectorService: InjectorService) {
                    expect(injectorService).to.be.an.instanceof(InjectorService);
                };

                injectorService.invoke(fnInvokable, undefined, [InjectorService]);
            }));

        });

        describe('injectorService.invokeMethod()', () => {

            it('should invoke a method of class (decorator)', inject([InjectorService], (injectorService: InjectorService) => {

                const instance = new InvokeMethodTest("1");

                const result = (instance as any).method();

                expect(result).to.be.an.instanceof(InjectorService);
            }));


            it('should invoke a method of class (decorator via Injector)', inject([InjectorService], (injectorService: InjectorService) => {

                const instance = new InvokeMethodTest("2");

                const result =  injectorService.invokeMethod(instance.method, {target: instance} as any);

                expect(result).to.be.an.instanceof(InjectorService);
            }));



            it('should invoke a method of class (injector)', inject([InjectorService], (injectorService: InjectorService) => {

                const result = injectorService.invokeMethod((injector) => injector, {
                    designParamTypes: [InjectorService]
                });

                expect(result).to.be.an.instanceof(InjectorService);
            }));

            it('should invoke a method of class (injector)', inject([InjectorService], (injectorService: InjectorService) => {

                const result = injectorService.invokeMethod((injector) => injector, [InjectorService]);

                expect(result).to.be.an.instanceof(InjectorService);
            }));


            it('should invoke a method of class (injector +  locals)', inject([InjectorService], (injectorService: InjectorService) => {
                
                const locals = new Map<Function, any>();
                locals.set(InjectorService, injectorService);

                const result = injectorService.invokeMethod((injector) => injector, {
                    designParamTypes: [InjectorService],
                    locals
                });

                expect(result).to.be.an.instanceof(InjectorService);
            }));

        });


    });
});