
import Chai = require('chai');
import {MiddlewareFactory} from "../lib/middleware-factory";
import {PromisifyFactory} from "../lib/promisify-factory";
import {MiddlewaresRegistry} from "../lib/middlewares-registry";

var expect:Chai.ExpectStatic = Chai.expect;

describe('MiddlewareFactory()', function(){
    var foo = new function(){};

    it('should adding "myMethod" (with GET verb + path) to MiddlewaresRegistry', function(){
        var path = "/route/test";
        var methodName = "myMethod";


        foo[methodName] = function(){};

        MiddlewareFactory(foo, methodName, {
            path:       path,
            handlers:   [{
                method:     'get',
                callback:   foo[methodName]
            }]
        });

       // expect(!!foo.middlewares).to.be.true;
        expect(foo.middlewares).to.be.an('object');
        expect(foo.middlewares[methodName]).to.be.instanceOf(MiddlewaresRegistry);
        expect(foo.middlewares[methodName].handlers).to.be.an('array');
        expect(foo.middlewares[methodName].handlers.length).to.equal(1);
        expect(foo.middlewares[methodName].path).to.be.an('string');
        expect(foo.middlewares[methodName].defaultMethod).to.be.an('string');
        expect(foo.middlewares[methodName].defaultMethod).to.equal('get');


    });

    it('should adding an "auth" option on "myMethod"', function(){
        var path = "/route/test";
        var methodName = "myMethod";

        foo[methodName] = function(){};

        MiddlewareFactory(foo, methodName, {
            path:       path,
            handlers:   [{
                method:     'auth',
                callback:   foo[methodName]
            }]
        });

        // expect(!!foo.middlewares).to.be.true;
        expect(foo.middlewares).to.be.an('object');
        expect(foo.middlewares[methodName]).to.be.instanceOf(MiddlewaresRegistry);
        expect(foo.middlewares[methodName].handlers).to.be.an('array');
        expect(foo.middlewares[methodName].handlers.length).to.equal(2);
        expect(foo.middlewares[methodName].path).to.be.an('string');


    });

    it('should adding a "required" option on "myMethod"', function(){
        var path = "/route/test";
        var methodName = "myMethod";


        foo[methodName] = function(){};

        MiddlewareFactory(foo, methodName, {
            path:       path,
            handlers:   [{
                method:     'required',
                callback:   foo[methodName]
            }]
        });

        // expect(!!foo.middlewares).to.be.true;
        expect(foo.middlewares).to.be.an('object');
        expect(foo.middlewares[methodName]).to.be.instanceOf(MiddlewaresRegistry);
        expect(foo.middlewares[methodName].handlers).to.be.an('array');
        expect(foo.middlewares[methodName].handlers.length).to.equal(3);
        expect(foo.middlewares[methodName].path).to.be.an('string');


    });

    it('should do something', function(){
        var path = "/route/test";
        var methodName = "myMethod2";


        foo[methodName] = function(){};

        MiddlewareFactory(foo, methodName, {
            path:       path,
            handlers:   [{
                method:     'param',
                callback:   foo[methodName]
            }]
        });

        // expect(!!foo.middlewares).to.be.true;
        expect(foo.middlewares).to.be.an('object');
        expect(foo.middlewares[methodName]).to.be.instanceOf(MiddlewaresRegistry);
        expect(foo.middlewares[methodName].handlers).to.be.an('array');
        expect(foo.middlewares[methodName].path).to.be.an('string');


    });

    it('should build routes on Express.Router', function() {


        var router:any = {
            _get:0,
            get:function(){
                this._get++;
            },
            post:function(){
                this._post = true;
            },
            use:function(){
                this._use = true;
            },
            auth:function(){
                this._auth = true;
            },

            put:function(){
                this._put = true;
            },

            delete:function(){
                this._delete = true
            },

            param:function(){
                this._param = true;
            },

            head:function(){
                this._head = true;
            }
        };

        for(var methods in foo.middlewares){
            foo.middlewares[methods].build(router, '/rest');
        }

        expect(router._get).to.equal(3, 'Haven\'t get');
        expect(router._param).to.equal(true, 'Haven\'t param');
    });


});
