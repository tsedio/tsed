import {GlobalProviders, Inject, InjectorService, registerProvider, Service} from "../../src";


describe("DI Async", () => {
  interface ConnectorFactory {
    get(): any;
  }

  // tslint:disable-next-line
  const ConnectorFactory = Symbol.for("ConnectorFactory");

  registerProvider({
    provide: ConnectorFactory,
    deps: [InjectorService],
    useFactory(injector: InjectorService) {
      return Promise.resolve(injector);
    }
  });

  @Service()
  class ServiceBase {
    constructor(@Inject(ConnectorFactory) public connector: ConnectorFactory) {

    }
  }

  after(() => {
    GlobalProviders.delete(ServiceBase);
    GlobalProviders.delete(ConnectorFactory);
  });

  it("should build service and his async dependencies", async () => {
    // GIVEN
    const injector = new InjectorService();

    // WHEN
    await injector.load();

    // THEN
    injector.get(ServiceBase)!.should.be.instanceof(ServiceBase);
    injector.get(ConnectorFactory)!.should.be.instanceof(InjectorService);
    injector.get<ServiceBase>(ServiceBase)!.connector.should.be.instanceof(InjectorService);
  });

});
