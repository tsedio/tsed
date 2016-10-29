import * as SuperTest from "supertest";
import {ExampleServer} from  "./../../examples/ExampleServer";
import {$log} from "ts-log-debug";
import {ServerLoader} from '../../server-loader';

export class FakeServer extends ServerLoader{
    public importMiddlewares(): ServerLoader {


        return this;
    }

    public createHttpServer(port): ServerLoader {

        (<any>this).httpServer = {
            port: undefined,
            events: {},
            listen: function(port) {this.port = port; return this},
            on: function(event, fn) {this.events[event] = fn; return this},
            fire: function(event) {this.events[event](); return this}
        };

        (<any>this).httpsPort = port;
        return this;
    }

    public createHttpsServer(options: any): ServerLoader {

        (<any>this).httpsServer = {
            port: undefined,
            events: {},
            listen: function(port) {this.port = port; return this},
            on: function(event, fn) {this.events[event] = fn; return this},
            fire: function(event) {this.events[event](); return this}
        };

        (<any>this).httpsPort = options.port;
        return this;
    }
}

export class FakeApplication extends ExampleServer {

    static Server: FakeApplication;

    constructor() {
        
        super();
        
        this
            .importMiddlewares()
            .importControllers()
            .importGlobalErrorsHanlder();
    }



    /*public use(endpoint, router) {
        this.list.push({endpoint: endpoint, router:router});
        this.app.use(endpoint, router);
    }*/

    public request(): SuperTest.SuperTest<any> {
        return SuperTest(this.getExpressApp());
    }

    static getInstance(): FakeApplication {

        $log.setRepporting({
            debug: false,
            info: false
        });

        if (FakeApplication.Server === undefined){
            FakeApplication.Server = new FakeApplication();
        }

        return FakeApplication.Server;
    }

}