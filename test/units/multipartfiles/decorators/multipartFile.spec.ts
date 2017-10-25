import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {Store} from "../../../../src/core/class/Store";
import {descriptorOf} from "../../../../src/core/utils";
import {MultipartFileFilter} from "../../../../src/multipartfiles/filters/MultipartFileFilter";
import {MultipartFilesFilter} from "../../../../src/multipartfiles/filters/MultipartFilesFilter";
import {MultipartFileMiddleware} from "../../../../src/multipartfiles/middlewares/MultipartFileMiddleware";
import {assert, expect} from "../../../tools";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};
const EndpointRegistry: any = {setMetadata: Sinon.stub()};
const Metadata: any = {getParamTypes: Sinon.stub().returns([Object])};

const middleware: any = Sinon.stub();
const UseBefore: any = Sinon.stub().returns(middleware);

const {MultipartFile} = Proxyquire.load("../../../../src/multipartfiles/decorators/multipartFile", {
    "../../filters/registries/ParamRegistry": {ParamRegistry},
    "../../core/class/Metadata": {Metadata},
    "../../mvc/decorators/method/useBefore": {UseBefore}
});

class Test {
    test() {
    }
}

describe("MultipartFile", () => {

    describe("as parameter decorator", () => {

        describe("one file", () => {
            before(() => {
                this.options = {};
                MultipartFile(this.options)(Test, "test", 0);
                this.args = ParamRegistry.useFilter.args[0];
                this.store = Store.fromMethod(Test, "test");
            });

            after(() => {
                delete this.args;
                delete this.options;
                ParamRegistry.useFilter = Sinon.stub();
            });

            it("should set endpoint metadata", () => {
                expect(this.store.get(MultipartFileMiddleware)).to.deep.eq(this.options);
            });

            it("should create middleware", () => {
                UseBefore.should.be.calledWithExactly(MultipartFileMiddleware);
                middleware.should.be.calledWithExactly(Test, "test", descriptorOf(Test, "test"));
            });

            it("should set params metadata", () => {
                expect(this.args[0]).to.eq(MultipartFileFilter);
                expect(this.args[1]).to.be.an("object");
                expect(this.args[1].propertyKey).to.eq("test");
                expect(this.args[1].target).to.eq(Test);
                expect(this.args[1].parameterIndex).to.eq(0);
            });
        });

        describe("multiple file", () => {
            before(() => {
                Metadata.getParamTypes.returns([Array]);
                this.options = {};
                MultipartFile(this.options)(Test, "test", 0);
                this.args = ParamRegistry.useFilter.args[0];
                this.store = Store.from(Test, "test", {
                    value: () => {
                    }
                });
            });

            after(() => {
                delete this.args;
                delete this.options;
                ParamRegistry.useFilter = Sinon.stub();
            });

            it("should set endpoint metadata", () => {
                expect(this.store.get(MultipartFileMiddleware)).to.deep.eq(this.options);
            });

            it("should create middleware", () => {
                UseBefore.should.be.calledWithExactly(MultipartFileMiddleware);
                middleware.should.be.calledWithExactly(Test, "test", descriptorOf(Test, "test"));
            });

            it("should set params metadata", () => {
                expect(this.args[0]).to.eq(MultipartFilesFilter);
                expect(this.args[1]).to.be.an("object");
                expect(this.args[1].propertyKey).to.eq("test");
                expect(this.args[1].target).to.eq(Test);
                expect(this.args[1].parameterIndex).to.eq(0);
            });
        });

    });

    describe("as other decorator type", () => {
        before(() => {
            ParamRegistry.useFilter = Sinon.stub();
            MultipartFile()(Test, "test", {
                value: () => {
                }
            });
        });

        it("should do nothing", () => {
            assert(!ParamRegistry.useFilter.called, "method is called");
        });
    });

});
