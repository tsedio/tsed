import Chai = require('chai');
import {MiddlewaresRegistry} from "../lib/middlewares-registry";

var expect:Chai.ExpectStatic = Chai.expect;

describe('MiddlewaresRegistry()', function(){

    var middlewares;

    it('should create new Middlewares registry', function(){

        middlewares = new MiddlewaresRegistry();

        expect(middlewares).to.be.an.instanceOf(MiddlewaresRegistry);

    });

    it('should add new middleware', function(){

        middlewares.push({
            handlers:[{
                method:'get',
                callback:new Function()
            }],
            path:'/myroute'
        });

        var router = {
            path:'',
            fn:false,

            get:function(path, fn){
                this.path = path;
                this.fn = fn;
            }
        };

        middlewares.build(router, '/rest');

        expect(router.path).to.equal('/rest/myroute');
        expect(router.fn).to.be.an.instanceOf(Function);
    });

    it('should add new middleware without path', function(){

        middlewares = new MiddlewaresRegistry();

        middlewares.push({
            handlers:[{
                method:'get',
                callback:new Function()
            }]
        });

        var router = {
            path:'',
            fn:false,

            get:function(path, fn){
                this.path = path;
                this.fn = fn;
            }
        };

        middlewares.build(router, '/rest');

        expect(router.path).to.equal('/rest');
        expect(router.fn).to.be.an.instanceOf(Function);
    });

});