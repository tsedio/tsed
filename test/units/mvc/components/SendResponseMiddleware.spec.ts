import {MiddlewareService} from "../../../../src";
import {SendResponseMiddleware} from "../../../../src/mvc/components/SendResponseMiddleware";
import {inject} from "../../../../src/testing/inject";
import {FakeResponse} from "../../../helper/FakeResponse";
import {expect} from "../../../tools";

describe("SendResponseMiddleware :", () => {


    it("should send response (boolean)", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        const fakeResponse = new FakeResponse();
        const middleware = middlewareService.invoke<SendResponseMiddleware>(SendResponseMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(true, fakeResponse as any);

        expect(fakeResponse._body).to.be.a("string");
        expect(fakeResponse._body).to.equal("true");
    }));

    it("should send response (number)", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        const fakeResponse = new FakeResponse();
        const middleware = middlewareService.invoke<SendResponseMiddleware>(SendResponseMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(1, fakeResponse as any);

        expect(fakeResponse._body).to.be.a("string");
        expect(fakeResponse._body).to.equal("1");
    }));

    it("should send response (null)", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        const fakeResponse = new FakeResponse();
        const middleware = middlewareService.invoke<SendResponseMiddleware>(SendResponseMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(null, fakeResponse as any);

        expect(fakeResponse._body).to.be.a("string");
        expect(fakeResponse._body).to.equal("null");
    }));

    it("should send response (date)", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        const fakeResponse = new FakeResponse();
        const date = new Date();
        const middleware = middlewareService.invoke<SendResponseMiddleware>(SendResponseMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(date, fakeResponse as any);

        expect(fakeResponse._body).to.be.a("string");
        expect(fakeResponse._body).to.equal(JSON.stringify(date));

    }));

    it("should send nothing (undefined)", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        const fakeResponse = new FakeResponse();
        const middleware = middlewareService.invoke<SendResponseMiddleware>(SendResponseMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(undefined, fakeResponse as any);

        expect(fakeResponse._body).to.equal("");

    }));

    it("should send response (object)", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        const fakeResponse = new FakeResponse();
        const middleware = middlewareService.invoke<SendResponseMiddleware>(SendResponseMiddleware);
        const obj = {};

        expect(middleware).not.to.be.undefined;

        middleware.use(obj, fakeResponse as any);

        expect(fakeResponse._body).to.be.a("string");
        expect(fakeResponse._body).to.equal(JSON.stringify(obj));

    }));

});