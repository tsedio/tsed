import * as Chai from "chai";
import InjectorService from '../src/services/injector';
import {inject} from '../src/testing/inject';

const expect: Chai.ExpectStatic = Chai.expect;

interface myFactory {
  method(): string;
}

const myFactory = function() {
    this.method = function(){
        return "test";
    }
};

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


        describe('injectorService.invokeMethod()', () => {

            it('should invokeMethod a function', inject([InjectorService], (injectorService: InjectorService) => {


                const fnInvokable = function(injectorService: InjectorService) {

                    expect(injectorService).to.be.an.instanceof(InjectorService);

                };


                injectorService.invoke(fnInvokable, undefined, [InjectorService]);
            }));

        });


    });
});