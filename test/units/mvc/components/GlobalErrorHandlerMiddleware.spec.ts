import {assert, expect} from "../../../tools";
import {inject} from "../../../../src/testing/inject";
import {GlobalErrorHandlerMiddleware, MiddlewareService} from "../../../../src";
import {FakeResponse} from "../../../helper/FakeResponse";
import {FakeRequest} from "../../../helper/FakeRequest";
import * as Sinon from "sinon";
import {BadRequest} from "ts-httpexceptions/lib";


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

        describe("headerSent", () => {
            before(() => {
                this.response["headersSent"] = true;
                this.error = new Error("test");
                this.nextSpy = Sinon.stub();

                this.middleware.use(
                    this.error,
                    this.responseStub,
                    this.response,
                    this.nextSpy
                );
            });

            after(() => {
                delete this.error;
                delete this.nextSpy;
            });

            it("should have called next function", () => {
                assert(this.nextSpy.calledWith(this.error));
            });

            it("should have an empty body", () => {
                expect(this.response._body).is.equal("");
            });
        });

        describe("instanceof Exception", () => {
            before(() => {
                this.response["headersSent"] = false;
                this.error = new BadRequest("test");
                this.nextSpy = Sinon.stub();

                this.middleware.use(
                    this.error,
                    this.responseStub,
                    this.response,
                    this.nextSpy
                );
            });

            after(() => {
                delete this.error;
                delete this.nextSpy;
            });

            it("should have called next function", () => {
                assert(this.nextSpy.calledWith());
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
                this.response["headersSent"] = false;
                this.error = "message";
                this.nextSpy = Sinon.stub();

                this.middleware.use(
                    this.error,
                    this.responseStub,
                    this.response,
                    this.nextSpy
                );
            });

            after(() => {
                delete this.error;
                delete this.nextSpy;
            });

            it("should have called next function", () => {
                assert(this.nextSpy.calledWith());
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
                this.response["headersSent"] = false;
                this.error = new Error("test");
                this.nextSpy = Sinon.stub();

                this.middleware.use(
                    this.error,
                    this.responseStub,
                    this.response,
                    this.nextSpy
                );
            });

            after(() => {
                delete this.error;
                delete this.nextSpy;
            });

            it("should have called next function", () => {
                assert(this.nextSpy.calledWith());
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
