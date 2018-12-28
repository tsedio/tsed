import {InjectorService, ProviderScope} from "@tsed/common";
import {bootstrap, inject, TestContext} from "@tsed/testing";
import {ProductsCtrl} from "./app/controllers/products/ProductsCtrl";
import {InnerService} from "./app/services/InnerService";
import {OuterService} from "./app/services/OuterService";
import {FakeServer} from "./app/FakeServer";
import {expect} from "chai";

describe("DI", () => {
  before(async () => {
    await bootstrap(FakeServer)();
    await inject([InjectorService], (injector: InjectorService) => {
      this.locals = new Map<string | Function, any>();
      const provider = injector.getProvider(ProductsCtrl)!;
      const target = provider.useClass;

      this.rebuildHandler = provider.scope !== ProviderScope.SINGLETON;

      this.instance = injector.invoke(target, this.locals, undefined, true);
    })();
  });

  after(TestContext.reset);

  it("should setting rebuild handler to true", () => {
    expect(this.rebuildHandler).to.eq(true);
  });

  it("should create a new instance", () => {
    expect(this.instance).to.be.instanceof(ProductsCtrl);
    expect(this.instance.innerService).to.be.instanceof(InnerService);
    expect(this.instance.outerService).to.be.instanceof(OuterService);
    expect(this.instance.outerService.innerService).to.be.instanceof(InnerService);
  });

  it("should create services based on locals container", () => {
    expect(this.instance.innerService).to.eq(this.instance.outerService.innerService);
  });

  it("should fill locals map", () => {
    expect(this.locals.has(ProductsCtrl)).to.eq(false);
    expect(this.locals.has(InnerService)).to.eq(true);
    expect(this.locals.has(OuterService)).to.eq(true);
  });
});
