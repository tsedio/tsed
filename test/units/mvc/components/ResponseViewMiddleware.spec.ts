import {MiddlewareService} from "../../../../src";
import {ResponseViewMiddleware} from "../../../../src/common/mvc/components/ResponseViewMiddleware";
import {inject} from "../../../../src/testing";
import {expect, Sinon} from "../../../tools";

describe("ResponseViewMiddleware :", () => {

    before(inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        this.response = {
            status: () => {
            },
            render: Sinon.stub()
        };

        this.endpoint = {
            store: {
                get: (type: any) => {
                    return type === ResponseViewMiddleware ? {
                        viewPath: "page.html",
                        viewOptions: {test: "test"}
                    } : {test: "test"};
                }
            }
        };

        this.middleware = middlewareService.invoke<ResponseViewMiddleware>(ResponseViewMiddleware);
    }));

    describe("when header isn't sent", () => {
        before(() => {
            this.middleware.use(
                {},
                this.endpoint,
                this.response as any
            );
        });
        after(() => {
            this.response.render.reset();
        });
        it("should have middleware", () => {
            expect(this.middleware).not.to.be.undefined;
        });

        it("should set header to the response object", () => {
            this.response.render.should.be.calledWithExactly("page.html", {test: "test"}, Sinon.match.func);
        });
    });

    describe("when header isn't sent but view path is wrong", () => {
        before(() => {
            this.middleware.use(
                {},
                {
                    store: {
                        get: (type: any) => {
                            return type === ResponseViewMiddleware ? {
                                viewOptions: {test: "test"}
                            } : {test: "test"};
                        }
                    }
                },
                this.response as any
            );
        });
        after(() => {
            this.response.render.reset();
        });
        it("should have middleware", () => {
            expect(this.middleware).not.to.be.undefined;
        });

        it("should set header to the response object", () => {
            this.response.render.should.not.be.called;
        });
    });
});