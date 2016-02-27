import Chai = require('chai');
import {PromisifyFactory} from "../lib/promisify-factory";
import Promise = require('bluebird');
import {BadRequest} from "httpexceptions/lib/badrequest";

var expect:Chai.ExpectStatic = Chai.expect;


class Foo{
    middlewares:any;
    called:boolean = false;

    myMethod(request, response, next){
        this.called = true;
    }

    myMethodReturnValue(request, response, next){
        this.called = true;

        return {data:'yes', _id:1};
    }

    myMethodPromised(request, response, next){
        this.called = true;

        return new Promise(function(resolve, reject){

            resolve({data:'yes', _id:1});

        });
    }

    myMethodThrowException(){
        this.called = true;
        throw new BadRequest('test');
    }
}

class Response{
    _status:number;
    _location:string;
    _json:any;
    _headers:string = '';

    public status(value:number) {
        this._status = value;
        return this;
    }

    public location(value:string) {
        this._location = value;
        return this;
    }

    public json(value:any) {
        this._json = value;
        return this;
    }

    public setHeader(key, value){
        this._headers += key +':' +value +'\n';
        return this;
    }
}


describe('PromisifyFactory()', function() {

    it('should do create a function', function () {

        var foo = new Foo();
        var fn = PromisifyFactory(foo, 'myMethod');

        expect(fn).to.be.instanceOf(Function);
        expect(fn).to.not.equal(foo.myMethod);

    });

    describe('PromisifyFactory().decorator', function() {

        it('should return promise ', function (done) {

            var request = {};
            var response = {};
            var next =  function(){

            };

            var foo = new Foo();
            var fn = PromisifyFactory(foo, foo.myMethod);
            var promise = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);
            expect(foo.called).to.be.true;

            promise.then(function(data){

                expect(data).to.equal(undefined);

                done();
            });

        });

        it('should run a method wich return value', function (done) {

            var request = {};
            var response = new Response();
            var next =  function(){

            };

            var foo = new Foo();
            var fn = PromisifyFactory(foo, foo.myMethodReturnValue);
            var promise = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);
            expect(foo.called).to.be.true;

            promise.then(function(data){

                expect(data).to.be.an('object');
                expect(data.data).to.equal('yes');


                //Response value
                expect(response._status).to.equal(200);
                expect(response._headers).to.contain('Content-Type:text/json');
                expect(JSON.stringify(response._json)).to.equal('{"data":"yes","_id":1}');

                done();
            });

            //

        });

        it('should run a method wich return promise', function (done) {

            var request = {
                method:'POST',
                path:'rest/test'
            };
            var response = new Response();
            var next =  function(){

            };

            var foo = new Foo();
            var fn = PromisifyFactory(foo, foo.myMethodPromised);
            var promise = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);
            expect(foo.called).to.be.true;


            promise.then(function(data){

                expect(data).to.be.an('object');
                expect(data.data).to.equal('yes');

                //Response value
                expect(response._status).to.equal(201);
                expect(response._location).to.equal('rest/test/1');
                expect(response._headers).to.contain('Content-Type:text/json');
                expect(JSON.stringify(response._json)).to.equal('{"data":"yes","_id":1}');

                done();
            });


            //

        });

        it('should run a method wich throw error', function (done) {

            var request = {};
            var response = new Response();
            var next =  function(){

            };

            var foo = new Foo();
            var fn = PromisifyFactory(foo, foo.myMethodThrowException);

            var promise = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);

            promise.then(
                function(data){
                    expect(true).to.be.false;
                    done();
                },
                function(err){
                    console.log(err);
                    expect(err).to.be.an.instanceOf(BadRequest);
                    done();
                });


        });
    });

});