import * as SuperTest from "supertest";
import {ExampleServer} from  "./../../examples/ExampleServer";
import {$log} from "ts-log-debug";

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