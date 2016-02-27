import Chai = require('chai');
import {ParamsRequiredFactory} from "../lib/params-required-factory";
import {PathParamsRequired} from "../decorators/path-params-required";
import {MiddlewaresRegistry} from "../lib/middlewares-registry";
import {BadRequest} from 'httpexceptions/lib/badrequest';

var expect:Chai.ExpectStatic = Chai.expect;


class Foo{
    middlewares:any;
    called:boolean = false;

    myMethod(request, response, next){
        this.called = true;
    }
}


describe('ParamsRequiredFactory()', function() {

    it('should do create a function', function(){

        var fn = ParamsRequiredFactory(['test', 'test2'], 'body');

        expect(fn).to.be.instanceOf(Function);

    });

    it('should add a new middleware', function(){

        var foo = new Foo();
        var fn = ParamsRequiredFactory(['test'], 'params');

        var descriptor = fn(foo, 'myMethod', {});

        expect(descriptor).to.be.an('object');
        expect(foo.middlewares.myMethod).to.be.instanceOf(MiddlewaresRegistry);
        expect(foo.middlewares.myMethod.handlers).to.be.an('array');
        expect(foo.middlewares.myMethod.handlers.length).to.equal(1);


        var called = false;
        var request = {
            params:{
                test:'hello'
            }
        };

        var next = function(value){
            called = true;
            expect(value).to.equal(undefined); //not error
        };


        foo.middlewares.myMethod.handlers[0].callback(request, {}, next);

        expect(called).to.be.true;

    });

    it('should return error', function(){

        var foo = new Foo();
        var fn = ParamsRequiredFactory(['test2'], 'params');

        var descriptor = fn(foo, 'myMethod', {});

        expect(descriptor).to.be.an('object');
        expect(foo.middlewares.myMethod).to.be.instanceOf(MiddlewaresRegistry);
        expect(foo.middlewares.myMethod.handlers).to.be.an('array');
        expect(foo.middlewares.myMethod.handlers.length).to.equal(1);


        var called = false;
        var request = {
            params:{
                test:'hello'
            }
        };

        var next = function(value){
            called = true;
            expect(value).to.be.an.instanceOf(BadRequest); //error
        };


        foo.middlewares.myMethod.handlers[0].callback(request, {}, next);

        expect(called).to.be.true;

    });

});