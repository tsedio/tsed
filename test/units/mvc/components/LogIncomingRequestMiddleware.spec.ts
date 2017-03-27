import {expect} from "../../../tools";

import {MiddlewareService} from "../../../../src/mvc/services/MiddlewareService";
import {FakeRequest} from "../../../helper/FakeRequest";
import {inject} from "../../../../src/testing/inject";
import {LogIncomingRequestMiddleware} from "../../../../src/mvc/components/LogIncomingRequestMiddleware";

describe("LogIncomingRequestMiddleware", () => {

    before(inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        this.middleware = middlewareService.invoke<LogIncomingRequestMiddleware>(LogIncomingRequestMiddleware);
        this.request = new FakeRequest();
        this.request.mime = "application/json";
        this.request.headers = {};

        this.middleware.use(this.request);
    }));

    it("should have been decorated request", () => {
        expect(this.request.id).to.eq(1);
        expect(this.request.tagId).to.eq("[#1]");
        expect(this.request.tsExpressHandleStart).to.be.a("date");
    });
});