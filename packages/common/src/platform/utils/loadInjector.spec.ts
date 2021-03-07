import {Container, Injectable, InjectorService, LocalsContainer} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {PlatformModule} from "../PlatformModule";
import {loadInjector} from "./loadInjector";

const sandbox = Sinon.createSandbox();
describe("loadInjector", () => {
  after(() => sandbox.restore());
  it("should load injector", () => {
    // GIVEN
    @Injectable()
    class TestService {}

    @Injectable()
    class TestService2 {}

    const injector = new InjectorService();

    sandbox.spy(injector, "addProviders");
    sandbox.spy(injector, "invoke");
    sandbox.stub(injector.logger, "debug");
    sandbox.stub(injector, "load").resolves(new LocalsContainer());

    injector.add(TestService);

    const container = new Container();

    container.add(PlatformModule);
    container.add(TestService);
    container.add(TestService2);

    // WHEN
    loadInjector(injector, container);

    // THEN
    expect(stub(injector.addProviders)).to.have.been.calledWithExactly(container);
    expect(stub(injector.invoke)).to.have.been.calledWithExactly(PlatformModule);
    expect(stub(injector.load)).to.have.been.calledWithExactly(container);

    stub(injector.logger.debug).restore();
  });
});
