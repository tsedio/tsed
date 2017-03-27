import {expect} from "../../../tools";
import {MiddlewareService} from "../../../../src";
import {inject} from "../../../../src/testing/inject";
import {ResponseViewMiddleware} from "../../../../src/mvc/components/ResponseViewMiddleware";

describe("ResponseViewMiddleware :", () => {

    it("should set header to the response object", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        let view, data;

        const response = {
            status: function () {
            },
            render: function (v, d) {
                view = v;
                data = d;
            }
        };

        const endpoint = {
            getMetadata: function (type) {
                return type === ResponseViewMiddleware ? {
                    viewPath: "page.html",
                    viewOptions: {test: "test"}
                } : {test: "test"};
            }
        };

        const middleware = middlewareService.invoke<ResponseViewMiddleware>(ResponseViewMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(
            {},
            endpoint as any,
            response as any
        );

        expect(view).to.equal("page.html");
        expect(data.test).to.equal("test");

    }));

    it("should set header to the response object", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        let view, data;

        const response = {
            status: function () {
            },
            render: function (v, d) {
                view = v;
                data = d;
            }
        };

        const endpoint = {
            getMetadata: function (type) {
                return type === ResponseViewMiddleware ? {
                    viewPath: "page.html",
                    viewOptions: {test: "test"}
                } : {test: "test"};
            }
        };

        const middleware = middlewareService.invoke<ResponseViewMiddleware>(ResponseViewMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(
            {},
            endpoint as any,
            response as any
        );

        expect(view).to.equal("page.html");

    }));

    it("should do nothing when header is sent", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        let view, data;

        const response = {
            headersSent: true,
            status: function () {
            },
            render: function (v, d) {
                view = v;
                data = d;
            }
        };

        const endpoint = {
            getMetadata: function (type) {
                return type === ResponseViewMiddleware ? {
                    viewPath: "page.html",
                    viewOptions: {test: "test"}
                } : {test: "test"};
            }
        };

        const middleware = middlewareService.invoke<ResponseViewMiddleware>(ResponseViewMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(
            {},
            endpoint as any,
            response as any
        );

        expect(view).to.equal(undefined);
        expect(data).to.equal(undefined);

    }));


    it("should do nothing when header is sent", inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        let view, data;

        const response = {
            status: function () {
            },
            render: function (v, d) {
                view = v;
                data = d;
            }
        };

        const endpoint = {
            getMetadata: function (type) {
                return type === ResponseViewMiddleware ? {viewPath: undefined, viewOptions: undefined} : {test: "test"};
            }
        };

        const middleware = middlewareService.invoke<ResponseViewMiddleware>(ResponseViewMiddleware);

        expect(middleware).not.to.be.undefined;

        middleware.use(
            {},
            endpoint as any,
            response as any
        );

        expect(view).to.equal(undefined);
        expect(data).to.equal(undefined);

    }));

});