import {Container, Injectable, InjectorService, LocalsContainer} from "@tsed/di";
import {stub} from "../../../../../test/helper/tools";
import {loadInjector} from "./loadInjector";

describe("loadInjector", () => {
  afterAll(() => jest.resetAllMocks());
  it("should load injector", () => {
    // GIVEN
    @Injectable()
    class TestService {}

    @Injectable()
    class TestService2 {}

    const injector = new InjectorService();

    jest.spyOn(injector, "addProviders");
    jest.spyOn(injector, "invoke");
    jest.spyOn(injector.logger, "debug");
    jest.spyOn(injector, "load").mockResolvedValue(new LocalsContainer());

    injector.add(TestService);

    const container = new Container();

    container.add(TestService);
    container.add(TestService2);

    // WHEN
    loadInjector(injector, container);

    // THEN
    expect(stub(injector.addProviders)).toBeCalledWith(container);
    expect(stub(injector.load)).toBeCalledWith(container);
  });
});
