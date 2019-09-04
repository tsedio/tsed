import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {Container, Injectable, InjectorService, LocalsContainer} from "../../../../di/src";
import {MVC_MODULE} from "../../../src/mvc";
import {createExpressApplication} from "../../../src/server";
import {loadInjector} from "../../../src/server/utils/loadInjector";

describe("loadInjector", () => {
  it("should load injector", () => {
    // GIVEN
    @Injectable()
    class TestService {
    }

    @Injectable()
    class TestService2 {
    }

    const injector = new InjectorService();

    Sinon.spy(injector, "addProviders");
    Sinon.spy(injector, "invoke");
    Sinon.stub(injector.logger, "debug");
    Sinon.stub(injector, "load").resolves(new LocalsContainer());

    injector.add(TestService);

    const container = new Container();

    createExpressApplication(injector);

    container.add(MVC_MODULE);
    container.add(TestService);
    container.add(TestService2);

    // WHEN
    loadInjector(injector, container);

    // THEN
    stub(injector.addProviders).should.have.been.calledWithExactly(container);
    stub(injector.invoke).should.have.been.calledWithExactly(MVC_MODULE);
    stub(injector.load).should.have.been.calledWithExactly(container);

    stub(injector.logger.debug).restore();
  });
});
