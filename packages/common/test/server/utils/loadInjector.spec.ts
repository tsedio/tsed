import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {GlobalProviders, Injectable, InjectorService} from "../../../../di/src";
import {ConverterService} from "../../../src/converters";
import {ParseService, ValidationService} from "../../../src/mvc";
import {createExpressApplication, createHttpServer, createHttpsServer, createInjector} from "../../../src/server";
import {loadInjector} from "../../../src/server/utils/loadInjector";

describe("loadInjector", () => {
  it("should load injector", () => {
    // GIVEN
    @Injectable()
    class TestService {
    }

    const injector = new InjectorService();

    Sinon.spy(injector, "addProviders");
    Sinon.spy(injector, "invoke");
    Sinon.stub(injector, "load");

    injector.add(TestService);

    // WHEN
    loadInjector(injector);

    // THEN
    stub(injector.addProviders).should.have.been.calledWithExactly(GlobalProviders);
    stub(injector.invoke).should.have.been.calledWithExactly(ConverterService);
    stub(injector.invoke).should.have.been.calledWithExactly(ParseService);
    stub(injector.invoke).should.have.been.calledWithExactly(ValidationService);
    stub(injector.load).should.have.been.calledWithExactly();
  });
});
