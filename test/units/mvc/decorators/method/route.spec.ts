import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";

const middleware: any = Sinon.stub();
const Use: any = Sinon.stub().returns(middleware);

const {All, Get, Post, Put, Delete, Head, Patch} = Proxyquire.load("../../../../../src/mvc/decorators/method/route", {
    "./use": {Use}
});

class Test {

}

describe("Route decorators", () => {
    describe("All", () => {

        before(() => {
            this.options = ["/", () => {
            }];
            All(...this.options);
        });

        after(() => {
            delete this.descriptor;
            delete this.options;
        });

        it("should create middleware", () => {
            assert(Use.calledWith("all", ...this.options[0]));
        });

    });

    describe("Get", () => {

        before(() => {
            this.options = ["/", () => {
            }];
            Get(...this.options);
        });

        after(() => {
            delete this.options;
        });

        it("should create middleware", () => {
            assert(Use.calledWith("get", ...this.options[0]));
        });

    });


    describe("Post", () => {

        before(() => {
            this.options = ["/", () => {
            }];
            Post(...this.options);
        });

        after(() => {
            delete this.options;
        });

        it("should create middleware", () => {
            assert(Use.calledWith("post", ...this.options[0]));
        });

    });

    describe("Put", () => {

        before(() => {
            this.options = ["/", () => {
            }];
            Put(...this.options);
        });

        after(() => {
            delete this.options;
        });

        it("should create middleware", () => {
            assert(Use.calledWith("put", ...this.options[0]));
        });

    });

    describe("Delete", () => {

        before(() => {
            this.options = ["/", () => {
            }];
            Delete(...this.options);
        });

        after(() => {
            delete this.options;
        });

        it("should create middleware", () => {
            assert(Use.calledWith("delete", ...this.options[0]));
        });

    });

    describe("Head", () => {

        before(() => {
            this.options = ["/", () => {
            }];
            Head(...this.options);
        });

        after(() => {
            delete this.options;
        });

        it("should create middleware", () => {
            assert(Use.calledWith("head", ...this.options[0]));
        });

    });

    describe("Patch", () => {

        before(() => {
            this.options = ["/", () => {
            }];
            Patch(...this.options);
        });

        after(() => {
            delete this.options;
        });

        it("should create middleware", () => {
            assert(Use.calledWith("patch", ...this.options[0]));
        });

    });
});
