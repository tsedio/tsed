import {Intercept} from "../decorators/intercept";
import {Interceptor} from "../decorators/interceptor";
import {Service} from "../decorators/service";
import {Container} from "../domain/Container";
import {InterceptorContext} from "../interfaces/InterceptorContext";
import {InterceptorMethods} from "../interfaces/InterceptorMethods";
import {GlobalProviders} from "../registries/GlobalProviders";
import {InjectorService} from "../services/InjectorService";

describe("DI Interceptor", () => {
  @Interceptor()
  class MyInterceptor implements InterceptorMethods {
    constructor(injSrv: InjectorService) {
      // do some logic
    }

    intercept(context: InterceptorContext<any>) {
      const r = typeof context.args[0] === "string" ? undefined : new Error(`Error message`);
      const retValue = context.next(r);

      return `${retValue} - ${context.options || ""} - intercepted`;
    }
  }

  @Service()
  class ServiceTest {
    @Intercept(MyInterceptor, "options data")
    exec(param: string) {
      return `Original data - ${param}`;
    }
  }

  afterAll(() => {
    GlobalProviders.delete(MyInterceptor);
    GlobalProviders.delete(ServiceTest);
  });

  it("should intercept the method", async () => {
    // GIVEN
    const injector = new InjectorService();
    const container = new Container();
    container.addProvider(MyInterceptor);
    container.addProvider(ServiceTest);

    await injector.load(container);

    const serviceTest = injector.invoke<ServiceTest>(ServiceTest)!;

    // WHEN
    const result = serviceTest.exec("param data");

    // THEN
    expect(result).toEqual("Original data - param data - options data - intercepted");
  });

  it("should intercept the method and throw error", async () => {
    // GIVEN
    const injector = new InjectorService();
    const container = new Container();
    container.addProvider(MyInterceptor);
    container.addProvider(ServiceTest);

    await injector.load(container);

    const serviceTest = await injector.invoke<ServiceTest>(ServiceTest)!;

    // WHEN
    let actualError;
    try {
      serviceTest.exec({} as any);
    } catch (er) {
      actualError = er;
    }
    // THEN
    expect(actualError.message).toEqual("Error message");
  });
});
