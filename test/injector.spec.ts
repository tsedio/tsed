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
    @Inject()
    method(injectorService: InjectorService) {
        console.log('Test', injectorService);
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

            it('should invoke a method of class', inject([InjectorService], (injectorService: InjectorService) => {

                const instance = new InvokeMethodTest();

                const result = instance.method(injectorService);



                expect(result).to.be.an.instanceof(InjectorService);
            }));

        });


    });
});