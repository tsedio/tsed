import {ServerSettingsService} from "@tsed/common";
import {inject} from "@tsed/testing";
import * as Mongoose from "mongoose";
import {MongooseService} from "../../../../src/mongoose";
import {Sinon} from "../../../tools";

describe("MongooseService", () => {

    describe("$onInit()", () => {
        describe("when url is given", () => {
            before(inject([MongooseService, ServerSettingsService], (mongooseService: MongooseService, serverSetttings: ServerSettingsService) => {
                this.mongooseService = mongooseService;

                serverSetttings.set("mongoose", {
                    url: "mongodb://test",
                    connectionOptions: {"options": "options"}
                });

                this.connectStub = Sinon.stub(this.mongooseService, "connect").returns(Promise.resolve("test"));

                return this.result = mongooseService.$onInit();
            }));

            after(inject([ServerSettingsService], (serverSetttings: ServerSettingsService) => {
                serverSetttings.set("mongoose", {
                    url: undefined,
                    connectionOptions: undefined,
                    urls: undefined
                });
                this.connectStub.restore();
            }));

            it("should call the connect method", () => {
                this.connectStub.should.have.been.calledWithExactly("default", "mongodb://test", {"options": "options"});
            });

            it("should return a promise", () => {
                this.result.should.eventually.deep.eq(["test"]);
            });
        });

        describe("when a list of urls is given", () => {
            before(inject([MongooseService, ServerSettingsService], (mongooseService: MongooseService, serverSetttings: ServerSettingsService) => {
                this.mongooseService = mongooseService;

                serverSetttings.set("mongoose", {
                    url: undefined,
                    connectionOptions: undefined,
                    urls: {
                        "db1": {
                            url: "mongodb://test",
                            connectionOptions: {"options": "options"}
                        }
                    }
                });

                this.connectStub = Sinon.stub(this.mongooseService, "connect").returns(Promise.resolve("test"));

                return this.result = mongooseService.$onInit();
            }));

            after(inject([ServerSettingsService], (serverSetttings: ServerSettingsService) => {
                serverSetttings.set("mongoose", {
                    url: undefined,
                    connectionOptions: undefined,
                    urls: undefined
                });
                this.connectStub.restore();
            }));

            it("should call the connect method", () => {
                this.connectStub.should.have.been.calledWithExactly("db1", "mongodb://test", {"options": "options"});
            });

            it("should return a promise", () => {
                return this.result.should.eventually.deep.eq(["test"]);
            });
        });

    });

    describe("connect()", () => {
        before(inject([MongooseService], (mongooseService: any) => {
            this.connectStub = Sinon.stub(Mongoose, "connect").returns(Promise.resolve("mongooseinstance"));

            return mongooseService.connect("key", "mongodb://test", {"options": "options"})
                .then(() => {
                    this.result = mongooseService.connect("key", "mongodb://test", {"options": "options"});
                    return this.result;
                });
        }));

        after(inject([ServerSettingsService], (serverSetttings: ServerSettingsService) => {
            serverSetttings.set("mongoose", {
                url: undefined,
                connectionOptions: undefined,
                urls: undefined
            });
            this.connectStub.restore();
        }));

        it("should call mongoose.connect", () => {
            this.connectStub.should.have.been.calledOnce;
            this.connectStub.should.have.been.calledWithExactly("mongodb://test", {"options": "options"});
        });

        it("should return the instance of mongoose", () => {
            return this.result.should.eventually.eq("mongooseinstance");
        });
    });
});