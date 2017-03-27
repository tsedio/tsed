import {$logStub, Sinon} from "../../../tools";

import {MiddlewareService} from "../../../../src/mvc/services/MiddlewareService";
import {FakeRequest} from "../../../helper/FakeRequest";
import {inject} from "../../../../src/testing/inject";
import {LogEndIncomingRequestMiddleware} from "../../../../src/mvc/components/LogEndIncomingRequestMiddleware";

describe("LogEndIncomingRequestMiddleware", () => {

    before(inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        $logStub.$log.debug.reset();
        this.middleware = middlewareService.invoke<LogEndIncomingRequestMiddleware>(LogEndIncomingRequestMiddleware);
        this.request = new FakeRequest();
        this.request.id = 1;
        this.request.tagId = "[1]";
        this.request.method = "POST";
        this.request.tsExpressHandleStart = new Date();
        this.request.mime = "application/json";
        this.request.originalUrl = "/";

        this.response = {};
        this.response._header = true;
        this.response.statusCode = 200;
        this.response.headers = {};

        this.middleware.use(this.request, this.response);
    }));

    it("should have been decorated request", () => {
        $logStub.$log.debug.should.have.been.calledWithExactly("[1]", "POST", "/", 200, Sinon.match.number, "ms");
    });

});