import * as Sinon from "sinon";
import {BadRequest} from "ts-httpexceptions/lib";
import {GlobalErrorHandlerMiddleware, MiddlewareService} from "../../../../src";
import {inject} from "../../../../src/testing/inject";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";
import {expect} from "../../../tools";


describe("GlobalErrorHandlerMiddleware", () => {
    before(inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        this.middleware = middlewareService.invoke<GlobalErrorHandlerMiddleware>(GlobalErrorHandlerMiddleware);
    }));

    after(() => {
        delete this.middleware;
    });

    describe("use()", () => {
        before(() => {
            this.response = new FakeResponse();
            this.request = new FakeRequest();
        });

        after(() => {
            delete this.response;
            delete this.request;
        });

        describe("instanceof Exception", () => {
            before(() => {
                this.error = new BadRequest("test");

                this.middleware.use(
                    this.error,
                    this.request,
                    this.response
                );
            });

            it("should have a message body", () => {
                expect(this.response._body).is.equal("test");
            });

            it("should have a status", () => {
                expect(this.response._status).is.equal(this.error.status);
            });
        });

        describe("Error as string", () => {
            before(() => {
                this.error = "message";
                this.nextSpy = Sinon.stub();

                this.middleware.use(
                    this.error,
                    this.request,
                    this.response
                );
            });

            after(() => {
                delete this.error;
            });

            it("should have an empty body", () => {
                expect(this.response._body).is.equal("message");
            });

            it("should have a status", () => {
                expect(this.response._status).is.equal(404);
            });
        });

        describe("InternalServerError", () => {
            before(() => {
                this.error = new Error("test");

                this.middleware.use(
                    this.error,
                    this.request,
                    this.response
                );
            });

            after(() => {
                delete this.error;
            });

            it("should have an empty body", () => {
                expect(this.response._body).is.equal("Internal Error");
            });

            it("should have a status", () => {
                expect(this.response._status).is.equal(500);
            });
        });
    });
});
