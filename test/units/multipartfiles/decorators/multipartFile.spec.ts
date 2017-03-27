import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {MultipartFileFilter, MultipartFilesFilter} from "../../../../src/multipartfiles/filters/MultipartFileFilter";
import {MultipartFileMiddleware} from "../../../../src/multipartfiles/middlewares/MultipartFileMiddleware";

const ParamsRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};
const EndpointRegistry: any = {setMetadata: Sinon.stub()};
const Metadata: any = {getParamTypes: Sinon.stub().returns([Object])};

const middleware: any = Sinon.stub();
const UseBefore: any = Sinon.stub().returns(middleware);

const {MultipartFile} = Proxyquire.load("../../../../src/multipartfiles/decorators/multipartFile", {
    "../../mvc/registries/ParamsRegistry": {ParamsRegistry},
    "../../mvc/registries/EndpointRegistry": {EndpointRegistry},
    "../../core/class/Metadata": {Metadata},
    "../../mvc/decorators/method/useBefore": {UseBefore}
});

class Test {

}

describe("MultipartFile", () => {

    describe("as parameter decorator", () => {

        describe("one file", () => {
            before(() => {
                this.options = {};
                MultipartFile(this.options)(Test, "test", 0);
                this.args = ParamsRegistry.useFilter.args[0];
            });

            after(() => {
                delete this.args;
                delete this.options;
                ParamsRegistry.useFilter = Sinon.stub();
            });

            it("should set endpoint metadata", () => {
                assert(EndpointRegistry.setMetadata.calledWith(MultipartFileMiddleware, this.options, Test, "test"), "shouldn't set metadata");
            });

            it("should create middleware", () => {
                assert(UseBefore.calledWith(MultipartFileMiddleware), "haven't the right middleware");
                assert(middleware.calledWith(Test, "test", 0));
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
                this.args = ParamsRegistry.useFilter.args[0];
            });

            after(() => {
                delete this.args;
                delete this.options;
                ParamsRegistry.useFilter = Sinon.stub();
            });

            it("should set endpoint metadata", () => {
                assert(EndpointRegistry.setMetadata.calledWith(
                    MultipartFileMiddleware,
                    this.options,
                    Test,
                    "test"
                ), "shouldn't set metadata");
            });

            it("should create middleware", () => {
                assert(UseBefore.calledWith(MultipartFileMiddleware), "haven't the right middleware");
                assert(middleware.calledWith(Test, "test", 0));
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
            ParamsRegistry.useFilter = Sinon.stub();
            MultipartFile()(Test, "test", {});
        });

        it("should do nothing", () => {
            assert(!ParamsRegistry.useFilter.called, "method is called");
        });
    });

});
